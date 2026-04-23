import Link from "next/link";

export const revalidate = 300;

type AwesomeCambio = {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
};

type Cambios = {
  USDBRL: AwesomeCambio;
  EURBRL: AwesomeCambio;
  GBPBRL: AwesomeCambio;
  ARSBRL: AwesomeCambio;
};

async function fetchCambios(): Promise<Cambios> {
  const url =
    "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,ARS-BRL";
  const res = await fetch(url, {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error("Falha ao consultar a cotação.");
  }
  return (await res.json()) as Cambios;
}

function formatarMoedaBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarNumero(valor: number, casas = 4): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor);
}

function parseNumber(s: string): number {
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function formatarDataHora(dateStr: string): string {
  const d = new Date(dateStr.replace(" ", "T"));
  if (!Number.isFinite(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function VariacaoBadge({ pct }: { pct: number }) {
  const positivo = pct >= 0;
  const cls = positivo
    ? "bg-emerald-50 text-emerald-700"
    : "bg-red-50 text-red-700";
  const sinal = positivo ? "+" : "";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {sinal}
      {formatarNumero(pct, 2)}%
    </span>
  );
}

export default async function Home() {
  const data = await fetchCambios();
  const usd = data.USDBRL;

  const bid = parseNumber(usd.bid);
  const high = parseNumber(usd.high);
  const low = parseNumber(usd.low);
  const pct = parseNumber(usd.pctChange);
  const varBid = parseNumber(usd.varBid);

  const sugestoes = [
    { label: "R$ 100", brl: 100 },
    { label: "US$ 100", usd: 100 },
    { label: "US$ 1.000", usd: 1000 },
  ] as const;

  const moedas = [
    { key: "EURBRL", label: "Euro (EUR/BRL)", v: data.EURBRL },
    { key: "GBPBRL", label: "Libra (GBP/BRL)", v: data.GBPBRL },
    { key: "ARSBRL", label: "Peso Argentino (ARS/BRL)", v: data.ARSBRL },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-sky-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Dólar Hoje (USD/BRL)
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-zinc-700">
            Confira a cotação do <strong>dólar hoje</strong>, variação, máxima e mínima.
            Use o conversor USD ⇄ BRL e veja outras moedas.
          </p>
          <p className="mt-3 text-sm text-zinc-600">
            Última atualização: <strong>{formatarDataHora(usd.create_date)}</strong>
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Cotação do dólar</h2>

            <div className="mt-5 grid gap-4">
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-zinc-700">Dólar comercial (referência)</p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                  <p className="text-3xl font-extrabold text-zinc-900">
                    {formatarMoedaBRL(bid)}
                  </p>
                  <div className="flex items-center gap-2">
                    <VariacaoBadge pct={pct} />
                    <span className="text-xs text-zinc-600">
                      ({varBid >= 0 ? "+" : ""}
                      {formatarNumero(varBid, 4)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-sm text-zinc-700">Máxima do dia</p>
                  <p className="mt-1 text-xl font-bold text-zinc-900">
                    {formatarMoedaBRL(high)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-sm text-zinc-700">Mínima do dia</p>
                  <p className="mt-1 text-xl font-bold text-zinc-900">
                    {formatarMoedaBRL(low)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Observação: cotação de referência. Pode haver diferença entre dólar comercial,
                turismo e taxas cobradas por bancos/corretoras.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Conversor USD ⇄ BRL</h2>

            <div className="mt-5 grid gap-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm text-zinc-700">Taxa usada (USD/BRL)</p>
                <p className="mt-1 text-xl font-bold text-zinc-900">{formatarNumero(bid, 4)}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-sky-50 p-4">
                  <p className="text-sm text-zinc-700">US$ 1 em reais</p>
                  <p className="mt-1 text-xl font-bold text-sky-700">
                    {formatarMoedaBRL(1 * bid)}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm text-zinc-700">R$ 1 em dólares</p>
                  <p className="mt-1 text-xl font-bold text-emerald-700">
                    US$ {formatarNumero(1 / bid, 4)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-sm font-medium text-zinc-900">Conversões rápidas</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {sugestoes.map((s) => {
                    const brl = "brl" in s ? s.brl : (s.usd ?? 0) * bid;
                    const usdVal = "usd" in s ? s.usd : (s.brl ?? 0) / bid;
                    return (
                      <div key={s.label} className="rounded-xl bg-zinc-50 p-3">
                        <p className="text-xs text-zinc-600">{s.label}</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">
                          {formatarMoedaBRL(brl)}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">
                          US$ {formatarNumero(usdVal, 2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Dica: para compras internacionais, considere IOF e spread do cartão.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900">Outras moedas (referência)</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left text-sm text-zinc-600">
                  <th className="border-b border-zinc-200 pb-3 pr-4">Moeda</th>
                  <th className="border-b border-zinc-200 pb-3 pr-4">Cotação</th>
                  <th className="border-b border-zinc-200 pb-3 pr-4">Variação</th>
                  <th className="border-b border-zinc-200 pb-3">Máx/Mín</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {moedas.map((m) => {
                  const bidM = parseNumber(m.v.bid);
                  const pctM = parseNumber(m.v.pctChange);
                  const highM = parseNumber(m.v.high);
                  const lowM = parseNumber(m.v.low);

                  return (
                    <tr key={m.key} className="align-top">
                      <td className="border-b border-zinc-100 py-3 pr-4 text-zinc-900 font-medium">
                        {m.label}
                      </td>
                      <td className="border-b border-zinc-100 py-3 pr-4 text-zinc-700">
                        {formatarMoedaBRL(bidM)}
                      </td>
                      <td className="border-b border-zinc-100 py-3 pr-4">
                        <VariacaoBadge pct={pctM} />
                      </td>
                      <td className="border-b border-zinc-100 py-3 text-zinc-700">
                        {formatarMoedaBRL(highM)} / {formatarMoedaBRL(lowM)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Fonte de dados: AwesomeAPI (cotações públicas). Não afiliado.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900">FAQ</h2>
          <div className="mt-6 grid gap-5">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">O que significa USD/BRL?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                USD/BRL é o par de moedas que representa quantos reais (BRL) equivalem a 1
                dólar americano (USD).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Dólar comercial x turismo: qual a diferença?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                O dólar comercial é usado em operações entre bancos e empresas. O dólar turismo
                costuma ter spread maior por custos e margens de operação.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Com que frequência a cotação atualiza?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Esta página utiliza cache para performance e atualiza aproximadamente a cada
                alguns minutos. Você pode recarregar a página para consultar novamente.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Posso usar para tomar decisão de investimento?</h3>
              <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                Os dados são informativos e podem divergir de cotações de corretoras/bancos.
                Para decisões, verifique em fontes oficiais e considere custos e taxas.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-zinc-700">
            Links úteis:
            <span className="ml-2">
              <Link className="text-sky-700 hover:underline" href="/privacidade">
                Privacidade
              </Link>
              <span className="px-2 text-zinc-400">·</span>
              <Link className="text-sky-700 hover:underline" href="/termos">
                Termos
              </Link>
              <span className="px-2 text-zinc-400">·</span>
              <Link className="text-sky-700 hover:underline" href="/contato">
                Contato
              </Link>
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
