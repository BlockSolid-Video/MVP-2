import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = body;

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
        
        return NextResponse.json({user: newUser, message: "User created successfully"}, {status: 201});

    } catch (error) {
        console.error(error);
    }
   
}
