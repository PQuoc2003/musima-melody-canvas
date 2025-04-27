
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPResetStepProps {
  form: UseFormReturn<{
    otp: string;
  }>;
  onSubmit: (values: { otp: string }) => Promise<void>;
  userEmail: string;
}

export const OTPResetStep = ({ form, onSubmit, userEmail }: OTPResetStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  onComplete={field.onChange}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, index) => (
                        <InputOTPSlot 
                          key={index} 
                          {...slot} 
                          index={index}
                        />
                      ))}
                    </InputOTPGroup>
                  )}
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
  );
};
