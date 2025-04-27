
import React from 'react';
import { Mail } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

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

interface EmailResetStepProps {
  form: UseFormReturn<{
    email: string;
  }>;
  onSubmit: (values: { email: string }) => Promise<void>;
}

export const EmailResetStep = ({ form, onSubmit }: EmailResetStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
  );
};
