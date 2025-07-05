import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const donationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  type: z.enum(["one-time", "recurring"]),
  donorEmail: z.string().email("Please enter a valid email address"),
  donorName: z.string().min(1, "Name is required"),
});

type DonationFormData = z.infer<typeof donationSchema>;

const predefinedAmounts = [25, 50, 100, 250];

export default function DonationForm() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 25,
      type: "one-time",
      donorEmail: "",
      donorName: "",
    },
  });

  const donationMutation = useMutation({
    mutationFn: async (data: DonationFormData) => {
      // Convert amount to cents for backend
      const donationData = {
        ...data,
        amount: data.amount * 100,
        currency: "USD",
      };
      
      const response = await apiRequest("POST", "/api/donations", donationData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Donation Initiated!",
        description: "Thank you for your generous donation. Processing payment...",
      });
      
      // In a real implementation, redirect to Paystack payment page
      // window.location.href = data.authorization_url;
      
      form.reset();
      setSelectedAmount(null);
      setCustomAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Donation Failed",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      form.setValue("amount", numValue);
    }
  };

  const onSubmit = (data: DonationFormData) => {
    donationMutation.mutate(data);
  };

  return (
    <Card className="bg-white rounded-2xl card-shadow">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <Label className="text-base font-semibold text-text-dark mb-4 block">
                Choose Amount
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    className={`py-4 text-lg font-semibold transition-all ${
                      selectedAmount === amount
                        ? "bg-primary-pink text-white border-primary-pink"
                        : "bg-accent-pink text-primary-pink hover:bg-primary-pink hover:text-white"
                    }`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="text-lg py-3"
                  min="1"
                  step="0.01"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light text-lg">
                  $
                </span>
              </div>
            </div>

            {/* Donation Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-text-dark">
                    Donation Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col sm:flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time" className="font-medium">
                          One-time donation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recurring" id="recurring" />
                        <Label htmlFor="recurring" className="font-medium">
                          Monthly donation
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Donor Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="donorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-primary text-lg py-4"
              disabled={donationMutation.isPending}
            >
              {donationMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Secure Donation via Paystack
                </>
              )}
            </Button>

            {/* Security Note */}
            <p className="text-sm text-text-light text-center">
              <Shield className="inline h-4 w-4 mr-1" />
              Your donation is secure and processed through Paystack
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
