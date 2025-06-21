"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "next-view-transitions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { getAvailableSocialProviders } from "@/lib/auth/providers";
import { ReactNode } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface AuthFormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
}

interface AuthFormConfig {
  title: string;
  description: string;
  badgeText: string;
  submitButtonText: string;
  loadingText: string;
  submitIcon: React.ComponentType<{ className?: string }>;
  alternativeActionText: string;
  alternativeActionLink: ReactNode;
  showTerms?: boolean;
  callbackURL: string;
}

interface AuthFormBaseProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  config: AuthFormConfig;
  fields: AuthFormField<T>[];
  availableProviders?: ReturnType<typeof getAvailableSocialProviders>;
}

export function AuthFormBase<T extends FieldValues>({
  form,
  onSubmit,
  loading,
  setLoading,
  config,
  fields,
  availableProviders,
}: AuthFormBaseProps<T>) {
  const handleSubmit = async (data: T) => {
    try {
      setLoading(true);
      await onSubmit(data);
    } catch {
      toast.error(
        "Something went wrong. Contact support if the issue persists"
      );
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md bg-background/80 backdrop-blur-sm shadow-xl">
      <CardHeader className="space-y-4 pb-2">
        {/* Welcome Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Sparkles className="mr-1 h-3 w-3" />
            {config.badgeText}
          </Badge>
        </div>
        
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {config.title}
          </CardTitle>
          <CardDescription className="text-sm md:text-base text-muted-foreground">
            {config.description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Social Login Buttons */}
            {availableProviders && availableProviders.length > 0 && (
              <>
                <SocialLoginButtons
                  callbackURL={config.callbackURL}
                  availableProviders={availableProviders}
                  loading={loading}
                  onLoadingChange={setLoading}
                />
                
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground font-medium">
                      Or continue with magic link
                    </span>
                  </div>
                </div>
              </>
            )}
            
            {/* Dynamic Form Fields */}
            {fields.map((field) => {
              const IconComponent = field.icon;
              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-foreground">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IconComponent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder={field.placeholder}
                            type={field.type || "text"}
                            {...formField}
                            disabled={loading}
                            className="pl-10 h-12 border-2 focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{config.loadingText}</span>
                </span>
              ) : (
                  <span className="flex items-center gap-2">
                  <config.submitIcon className="h-4 w-4" />
                  <span>{config.submitButtonText}</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
            
            {/* Alternative Action Link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {config.alternativeActionText}{" "}
                {config.alternativeActionLink}
              </p>
            </div>
          </form>
        </Form>
        
        {/* Terms and Privacy */}
        {config.showTerms && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-center text-xs text-muted-foreground/70 leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="cursor-pointer font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="cursor-pointer font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}