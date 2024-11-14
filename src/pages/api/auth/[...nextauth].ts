process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import NextAuth from "next-auth/next";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Faltando email ou password")
                }

                const auth = getAuth()

                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth, credentials.email, credentials.password
                    )
                    const user = userCredential.user

                    if (user) {
                        return { id: user.uid, email: user.email, name: user.displayName || user.email }
                    }
                    return null
                } catch (error) {
                    console.error('Erro duranto o sign in', error)
                    return null
                }
            }
        }),
    ],
    secret: process.env.JWT_SECRET as string
}
export default NextAuth(authOptions)
