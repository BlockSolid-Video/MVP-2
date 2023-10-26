import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import * as z from 'zod';
//Define scjema for input validation
const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        //check if user exists
        const existUserbyEmail = await db.user.findUnique({
            where: { email: email },
        });
        if (existUserbyEmail) {
            return NextResponse.json({user:null, message: "User already exists with that email"}, {status: 409});
        }

        //check if user exists
        const existUserbyUsername = await db.user.findUnique({
            where: { username: username },
        });
        if (existUserbyUsername) {
            return NextResponse.json({user:null, message: "User already exists with username"}, {status: 409});
        }

        const hashedPassword = await hash(password, 10);
        
        const newUser = await db.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
            },
        });
        
        const { password: newUserPassword, ...rest } = newUser;
        return NextResponse.json({user: rest, message: "User created successfully"}, {status: 201});

    } catch (error) {
        return NextResponse.json({message: "Something went wrong"}, {status: 500});

    }
   
}
