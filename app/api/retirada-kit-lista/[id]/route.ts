import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params

const session = await auth()
if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
}

const body = await request.json().catch(() => null)

// Aceita { kitretirado: boolean } (e tolera kitRetirado)
const raw = body?.kitretirado ?? body?.kitRetirado
if (typeof raw !== "boolean") {
    return NextResponse.json(
    { error: "Envie { kitretirado: true/false }", received: body },
    { status: 400 }
    )
}

const updated = await prisma.inscricao.update({
    where: { id },
    data: { kitretirado: raw },
    select: {
    id: true,
    kitretirado: true,
    retiradaKit: true,
    updatedAt: true,
    },
})

return NextResponse.json(updated)
}
