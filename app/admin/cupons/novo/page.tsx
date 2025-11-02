// app/admin/cupons/novo/page.tsx
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cupomSchema, type CupomFormData } from "@/lib/validations/cupom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Tag, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export default function NovoCupomPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CupomFormData>({
    resolver: zodResolver(cupomSchema),
    defaultValues: {
      ativo: true,
      usoPorUsuario: 1,
      tipoDesconto: "PERCENTUAL",
    },
  })

  const tipoDesconto = watch("tipoDesconto")
  const desconto = watch("desconto")
  const valorMinimo = watch("valorMinimo")

  const onSubmit = async (data: CupomFormData) => {
    setLoading(true)

    try {
      const response = await fetch("/api/cupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar cupom")
      }

      toast.success("Cupom criado com sucesso!", {
        description: `Código: ${result.codigo}`,
      })

      setTimeout(() => {
        router.push("/admin/cupons")
      }, 1500)

    } catch (error) {
      console.error("Erro ao criar cupom:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao criar cupom")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Novo Cupom</h1>
            <p className="text-muted-foreground">Criar cupom de desconto</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Preview do Cupom */}
        <Card className="border-dashed border-2 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Preview do Cupom
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="text-4xl font-bold font-mono tracking-wider">
                {watch("codigo") || "CÓDIGO"}
              </div>
              <div className="text-2xl font-semibold text-primary">
                {desconto ? (
                  tipoDesconto === "PERCENTUAL"
                    ? `${desconto}% OFF`
                    : `R$ ${desconto.toFixed(2)} OFF`
                ) : "0% OFF"}
              </div>
              {valorMinimo && (
                <div className="text-sm text-muted-foreground">
                  Válido para compras acima de R$ {valorMinimo.toFixed(2)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Código e origem do cupom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código do Cupom *</Label>
                <Input
                  id="codigo"
                  {...register("codigo")}
                  placeholder="PRIMEIRACOMPRA"
                  className="font-mono uppercase"
                  maxLength={20}
                />
                {errors.codigo && (
                  <p className="text-sm text-red-500">{errors.codigo.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Apenas letras MAIÚSCULAS e números
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origem">Origem *</Label>
                <Input
                  id="origem"
                  {...register("origem")}
                  placeholder="Instagram, Parceiro X, etc."
                />
                {errors.origem && (
                  <p className="text-sm text-red-500">{errors.origem.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                defaultChecked={true}
                onCheckedChange={(checked) => setValue("ativo", checked)}
              />
              <Label htmlFor="ativo" className="cursor-pointer">
                Ativar cupom imediatamente
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Desconto */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Desconto</CardTitle>
            <CardDescription>Tipo e valor do desconto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoDesconto">Tipo de Desconto *</Label>
                <Select
                  defaultValue="PERCENTUAL"
                  onValueChange={(value) => setValue("tipoDesconto", value as "PERCENTUAL" | "FIXO")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTUAL">Percentual (%)</SelectItem>
                    <SelectItem value="FIXO">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoDesconto && (
                  <p className="text-sm text-red-500">{errors.tipoDesconto.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="desconto">Valor do Desconto *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {tipoDesconto === "PERCENTUAL" ? "%" : "R$"}
                  </span>
                  <Input
                    id="desconto"
                    type="number"
                    step="0.01"
                    {...register("desconto", { valueAsNumber: true })}
                    placeholder={tipoDesconto === "PERCENTUAL" ? "10" : "20.00"}
                    className="pl-10"
                  />
                </div>
                {errors.desconto && (
                  <p className="text-sm text-red-500">{errors.desconto.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Período de Validade */}
        <Card>
          <CardHeader>
            <CardTitle>Período de Validade</CardTitle>
            <CardDescription>Quando o cupom estará ativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  {...register("dataInicio")}
                />
                {errors.dataInicio && (
                  <p className="text-sm text-red-500">{errors.dataInicio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataValidade">Data de Validade *</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  {...register("dataValidade")}
                />
                {errors.dataValidade && (
                  <p className="text-sm text-red-500">{errors.dataValidade.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limites de Uso */}
        <Card>
          <CardHeader>
            <CardTitle>Limites de Uso (Opcional)</CardTitle>
            <CardDescription>Restrições de utilização do cupom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usoMaximo">Uso Máximo Total</Label>
                <Input
                  id="usoMaximo"
                  type="number"
                  {...register("usoMaximo", {
                    setValueAs: (v) => v === "" ? null : parseInt(v)
                  })}
                  placeholder="Ilimitado"
                />
                <p className="text-xs text-muted-foreground">
                  Deixe vazio para ilimitado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usoPorUsuario">Uso por Usuário</Label>
                <Input
                  id="usoPorUsuario"
                  type="number"
                  {...register("usoPorUsuario", {
                    setValueAs: (v) => v === "" ? null : parseInt(v)
                  })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorMinimo">Valor Mínimo (R$)</Label>
                <Input
                  id="valorMinimo"
                  type="number"
                  step="0.01"
                  {...register("valorMinimo", {
                    setValueAs: (v) => v === "" ? null : parseFloat(v)
                  })}
                  placeholder="Sem mínimo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <Link href="/admin/cupons">
            <Button type="button" variant="outline" disabled={loading}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Tag className="mr-2 h-4 w-4" />
                Criar Cupom
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
