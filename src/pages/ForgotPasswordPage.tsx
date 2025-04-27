
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Please enter a valid 6-digit code' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmitEmail = async (values: EmailFormValues) => {
    try {
      // Here you would call your existing API to send OTP
      console.log('Requesting OTP for:', values.email);
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      });
      
      setUserEmail(values.email);
      setStep('otp');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitOTP = async (values: OTPFormValues) => {
    try {
      // Here you would call your existing API to verify OTP and trigger password reset
      console.log('Verifying OTP:', values.otp);
      
      toast({
        title: "Password Reset Successful",
        description: "A new password has been sent to your email.",
      });
      
      setStep('success');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 ${theme === 'dark' ? 'bg-musima-background' : 'bg-gray-50'}`}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {step === 'email' && "Enter your email to receive a verification code"}
            {step === 'otp' && "Enter the verification code sent to your email"}
            {step === 'success' && "Check your email for your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input 
                            placeholder="name@example.com" 
                            className="pl-10" 
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Send Verification Code</Button>
              </form>
            </Form>
          )}
          
          {step === 'otp' && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          render={({ slots }) => (
                            <InputOTPGroup className="gap-2">
                              {slots.map((slot, index) => (
                                <InputOTPSlot key={index} {...slot} />
                              ))}
                            </InputOTPGroup>
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-sm text-center text-muted-foreground">
                  Verification code sent to {userEmail}
                </div>
                <Button type="submit" className="w-full">Verify Code</Button>
              </form>
            </Form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                A new password has been sent to your email address. 
                Please use this password to log in, and then change it from your settings.
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link 
            to="/login" 
            className="flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;

