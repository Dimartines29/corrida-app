import { auth } from "@/auth"

export async function getSession() {
  return await auth()
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
