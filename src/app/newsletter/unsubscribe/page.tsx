import UnsubscribeCard from "@/components/public/newsletter/UnsubscribeCard";
export default async function UnsubscribePage({searchParams}:{searchParams:Promise<{token?:string}>}){const{token=""}=await searchParams;return <UnsubscribeCard token={token}/>;}
