
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface OTPResetStepProps {
  form: UseFormReturn<{
    otp?: string;
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
            <FormItem>
              <FormLabel className="text-center block">Verification Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="text-center"
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
