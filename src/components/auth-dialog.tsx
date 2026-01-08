'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { createUserProfileDocument } from '@/firebase/user';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis.' }),
});

const registerSchema = z.object({
    email: z.string().email({ message: 'Adresse e-mail invalide.' }),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });


interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const auth = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  
  const handleAuthSuccess = () => {
    onOpenChange(false);
    toast({
      title: 'Connexion réussie!',
      description: 'Bienvenue sur OmniCopy AI.',
    });
  };

  const handleAuthError = (error: any) => {
    let description = 'Une erreur inconnue est survenue.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            description = 'Adresse e-mail ou mot de passe incorrect.';
            break;
        case 'auth/email-already-in-use':
            description = 'Cette adresse e-mail est déjà utilisée par un autre compte.';
            break;
        case 'auth/weak-password':
            description = 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
            break;
        case 'auth/popup-closed-by-user':
            description = "La fenêtre de connexion a été fermée.";
            break;
        default:
            description = "Une erreur technique est survenue. Veuillez réessayer.";
            console.error("Auth Error:", error.code, error.message);
      }
    }
    toast({
      variant: 'destructive',
      title: 'Erreur d\'authentification',
      description,
    });
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await createUserProfileDocument(userCredential.user);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfileDocument(result.user); // Crée le profil si c'est un nouvel utilisateur
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accéder à votre compte</DialogTitle>
          <DialogDescription>
            Connectez-vous ou créez un compte pour sauvegarder vos générations.
          </DialogDescription>
        </DialogHeader>

        <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
          Continuer avec Google
        </Button>

        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OU</span>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Se connecter</TabsTrigger>
                <TabsTrigger value="register">Créer un compte</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                 <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 pt-4">
                        <FormField control={loginForm.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="nom@exemple.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={loginForm.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Se connecter
                        </Button>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="register">
                 <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 pt-4">
                        <FormField control={registerForm.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="nom@exemple.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={registerForm.control} name="password" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl><Input type="password" placeholder="6+ caractères" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Créer mon compte
                        </Button>
                    </form>
                </Form>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.66 1.67-3.86 0-6.99-3.16-6.99-7.02s3.13-7.02 6.99-7.02c1.93 0 3.39.77 4.6 1.95l2.62-2.58C18.04 1.41 15.65 0 12.48 0 5.88 0 .81 5.09.81 11.8s5.07 11.8 11.67 11.8c3.27 0 5.64-1.1 7.4-2.84 1.84-1.84 2.48-4.49 2.48-6.92 0-.77-.07-1.49-.2-2.18h-9.28z"
        fill="currentColor"
      />
    </svg>
  );
    