'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";


const FormSchema = z.object({
        email: z.string(),
        password: z.string().min(8),
    })

export default function SignInForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        
    })
    
    const onSubmit = () => {
        console.log("signed in")
    }
    return (
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="space-y-2"> 
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
               
                <Button className="w-full mt-6"  type="submit">Submit</Button>
            </form>
        </Form>
    )
}