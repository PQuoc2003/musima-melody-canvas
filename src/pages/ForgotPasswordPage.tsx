
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { EmailResetStep } from '@/components/auth/EmailResetStep';
import { OTPResetStep } from '@/components/auth/OTPResetStep';
import { SuccessResetStep } from '@/components/auth/SuccessResetStep';

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
  const { resetPassword } = useAuth();

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
      await resetPassword(values.email);
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
            <EmailResetStep 
              form={emailForm} 
              onSubmit={onSubmitEmail} 
            />
          )}
          
          {step === 'otp' && (
            <OTPResetStep 
              form={otpForm} 
              onSubmit={onSubmitOTP}
              userEmail={userEmail}
            />
          )}

          {step === 'success' && (
            <SuccessResetStep 
              onNavigateToLogin={() => navigate('/login')} 
            />
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
