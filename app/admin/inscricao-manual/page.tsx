// app/admin/inscricao-manual/page.tsx

'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inscricaoManualSchema, type InscricaoManual } from "@/lib/validations/inscricao"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

// Constantes de preços
const TAXA_INSCRICAO = 4.00;
const VALOR_ALMOCO = 35.90;

type Lote = {
  id: string
  nome: string
  preco: number
  ativo: boolean
}

export default function InscricaoManualPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loadingLotes, setLoadingLotes] = useState(true)
  const [valorEditadoManualmente, setValorEditadoManualmente] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm({resolver: zodResolver(inscricaoManualSchema),
    defaultValues: {
      possuiPlanoSaude: false,
      declaracaoSaude: false,
      valeAlmoco: false,
      valorPago: 0,
      statusInscricao: "PENDENTE" as const,
      statusPagamento: "PENDENTE" as const,
      metodoPagamento: "manual",
      enviarEmail: true,
    },
  })

  // Monitorar mudanças nos campos
  const loteIdSelecionado = useWatch({
    control,
    name: "loteId",
  });

  const valeAlmocoSelecionado = useWatch({
    control,
    name: "valeAlmoco",
  });

  // Buscar lotes disponíveis
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch("/api/lotes")
        const data = await response.json()

        setLotes(data)
      } catch (error) {

        toast.error("Erro ao carregar lotes disponíveis")
      } finally {
        setLoadingLotes(false)
      }
    }

    fetchLotes()
  }, [])

  // Calcular valor automaticamente
  useEffect(() => {
    // Só calcula se o usuário NÃO editou manualmente
    if (!valorEditadoManualmente && loteIdSelecionado && lotes.length > 0) {
      const loteSelecionado = lotes.find(l => l.id === loteIdSelecionado);

      if (loteSelecionado) {
        let valorTotal = loteSelecionado.preco + TAXA_INSCRICAO;

        if (valeAlmocoSelecionado) {
          valorTotal += VALOR_ALMOCO;
        }

        setValue("valorPago", valorTotal);
      }
    }
  }, [loteIdSelecionado, valeAlmocoSelecionado, lotes, valorEditadoManualmente, setValue]);

  const onSubmit = async (data: InscricaoManual) => {
    setLoading(true)

    try {
      const response = await fetch("/api/inscricao/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar inscrição")
      }

      toast.success("Inscrição manual criada com sucesso!", {
        description: `Código: ${result.inscricao.codigo}`,
      })

      // Redirecionar para a página de detalhes da inscrição
      setTimeout(() => {
        router.push(`/admin/inscricoes/${result.inscricao.id}`)
      }, 1500)

    } catch (error) {
      console.error("Erro ao criar inscrição:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao criar inscrição manual")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SiteHeader title="Inscrição manual" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas do participante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  {...register("nomeCompleto")}
                  placeholder="João da Silva"
                  className="text-muted-foreground"
                />
                {errors.nomeCompleto && (
                  <p className="text-sm text-red-500">{errors.nomeCompleto.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  {...register("cpf")}
                  placeholder="123.456.789-10"
                  maxLength={14}
                  className="text-muted-foreground"
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <Select onValueChange={(value) => setValue("sexo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sexo && (
                  <p className="text-sm text-red-500">{errors.sexo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  {...register("rg")}
                  placeholder="12.345.678-9"
                  className="text-muted-foreground"
                />
                {errors.rg && (
                  <p className="text-sm text-red-500">{errors.rg.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  {...register("dataNascimento")}
                  className="text-muted-foreground"
                />
                {errors.dataNascimento && (
                  <p className="text-sm text-red-500">{errors.dataNascimento.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  {...register("telefone")}
                  placeholder="(11) 99999-9999"
                  className="text-muted-foreground"
                />
                {errors.telefone && (
                  <p className="text-sm text-red-500">{errors.telefone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  {...register("endereco")}
                  placeholder="Rua Exemplo, 123"
                  className="text-muted-foreground"
                />
                {errors.endereco && (
                  <p className="text-sm text-red-500">{errors.endereco.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  {...register("bairro")}
                  placeholder="Centro"
                  className="text-muted-foreground"
                />
                {errors.bairro && (
                  <p className="text-sm text-red-500">{errors.bairro.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  {...register("cidade")}
                  placeholder="São Paulo"
                  className="text-muted-foreground"
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500">{errors.cidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado (UF) *</Label>
                <Input
                  id="estado"
                  {...register("estado")}
                  placeholder="SP"
                  maxLength={2}
                  className="text-muted-foreground"
                />
                {errors.estado && (
                  <p className="text-sm text-red-500">{errors.estado.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  {...register("cep")}
                  placeholder="12345-678"
                  maxLength={9}
                  className="text-muted-foreground"
                />
                {errors.cep && (
                  <p className="text-sm text-red-500">{errors.cep.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoria e Kit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select onValueChange={(value) => setValue("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Caminhada - 3km">Caminhada - 3km</SelectItem>
                    <SelectItem value="Corrida - 6km">Corrida - 6km</SelectItem>
                    <SelectItem value="Corrida - 10km">Corrida - 10km</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoria && (
                  <p className="text-sm text-red-500">{errors.categoria.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="loteId">Lote *</Label>
                {loadingLotes ? (
                  <div className="flex items-center justify-center h-10 border rounded">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <Select onValueChange={(value) => setValue("loteId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotes.map((lote) => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.nome} - R$ {lote.preco.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.loteId && (
                  <p className="text-sm text-red-500">{errors.loteId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="retiradaKit">Local de Retirada do Kit *</Label>
                <Select onValueChange={(value) => setValue("retiradaKit", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="The Chris - Shopping do avião">The Chris - Shopping do avião</SelectItem>
                    <SelectItem value="The Chris - Monte Carmo Shopping">The Chris - Monte Carmo Shopping</SelectItem>
                  </SelectContent>
                </Select>
                {errors.retiradaKit && (
                  <p className="text-sm text-red-500">{errors.retiradaKit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tamanhoCamisa">Tamanho da Camisa *</Label>
                <Select onValueChange={(value) => setValue("tamanhoCamisa", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="GG">GG</SelectItem>
                    <SelectItem value="XG">XG</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tamanhoCamisa && (
                  <p className="text-sm text-red-500">{errors.tamanhoCamisa.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="valeAlmoco"
                  onCheckedChange={(checked) => setValue("valeAlmoco", checked as boolean)}
                />
                <Label htmlFor="valeAlmoco" className="font-normal cursor-pointer">
                  Vale almoço (+R$ {VALOR_ALMOCO.toFixed(2)})
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Médicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contatoEmergencia">Contato de Emergência *</Label>
                <Input
                  id="contatoEmergencia"
                  {...register("contatoEmergencia")}
                  placeholder="Maria da Silva"
                  className="text-muted-foreground"
                />
                {errors.contatoEmergencia && (
                  <p className="text-sm text-red-500">{errors.contatoEmergencia.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneEmergencia">Telefone de Emergência *</Label>
                <Input
                  id="telefoneEmergencia"
                  {...register("telefoneEmergencia")}
                  placeholder="(11) 99999-9999"
                  className="text-muted-foreground"
                />
                {errors.telefoneEmergencia && (
                  <p className="text-sm text-red-500">{errors.telefoneEmergencia.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="possuiPlanoSaude"
                  onCheckedChange={(checked) => setValue("possuiPlanoSaude", checked as boolean)}
                />
                <Label htmlFor="possuiPlanoSaude" className="font-normal cursor-pointer">
                  Possui plano de saúde
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="declaracaoSaude"
                  onCheckedChange={(checked) => setValue("declaracaoSaude", checked as boolean)}
                />
                <Label htmlFor="declaracaoSaude" className="font-normal cursor-pointer">
                  Declarou estar apto para participar *
                </Label>
              </div>
            </div>
            {errors.declaracaoSaude && (
              <p className="text-sm text-red-500">{errors.declaracaoSaude.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Pagamento</CardTitle>
            <CardDescription>Configure o status e valor da inscrição</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statusInscricao">Status da Inscrição *</Label>
                <Select
                  defaultValue="PENDENTE"
                  onValueChange={(value) => setValue("statusInscricao", value as "PENDENTE" | "PAGO" | "CANCELADO")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="PAGO">Pago</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusPagamento">Status do Pagamento *</Label>
                <Select
                  defaultValue="PENDENTE"
                  onValueChange={(value) => setValue("statusPagamento", value as "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="APROVADO">Aprovado</SelectItem>
                    <SelectItem value="RECUSADO">Recusado</SelectItem>
                    <SelectItem value="REEMBOLSADO">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPagamento">Método de Pagamento *</Label>
                <Select
                  defaultValue="manual"
                  onValueChange={(value) => setValue("metodoPagamento", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="manual">Manual/Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="valorPago">Valor Total da Inscrição *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input id="valorPago" type="number" step="0.01" min="0" placeholder="0.00" className="pl-10 text-muted-foreground"
                    {...register("valorPago", {
                      valueAsNumber: true,
                      onChange: () => setValorEditadoManualmente(true)
                    })}
                  />
                </div>
                {errors.valorPago && (
                  <p className="text-sm text-red-500">{errors.valorPago.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Link href="/admin/inscricoes">
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
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Inscrição
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
