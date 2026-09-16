import { CalendarDays, ClipboardCheck, Heart, MessageCircle, ShieldCheck, UsersRound } from "lucide-react";
import ConsultationPlanner from "./ConsultationPlanner";
import styles from "./CombinedServicesPage.module.css";
import EditableText from "./EditableText";

type Variant="general"|"companionship"|"event";

const content={
  general:{eyebrow:"Take the first step",title:"Start with a conversation.",description:"A complimentary 30-minute conversation to understand what you’re looking for and explore the right next step together.",quote:"A simple first step toward meaningful support and connection.",items:[[MessageCircle,"Complimentary consultation","No cost, no obligation."],[ShieldCheck,"Private & thoughtful","Your information is handled with care."],[CalendarDays,"30 minutes","A focused and meaningful conversation."]]},
  companionship:{eyebrow:"Take the first step",title:"Let’s begin with a conversation.",description:"Tell us what companionship would look like for you or your loved one, and we’ll explore the right next step together.",quote:"Meaningful support begins by listening.",items:[[MessageCircle,"Complimentary consultation","No cost, no obligation."],[Heart,"Personal conversation","Centered on your interests and routine."],[CalendarDays,"30 minutes","A focused and meaningful first step."]]},
  event:{eyebrow:"Start here",title:"Tell us what you are planning.",description:"Share your goals, audience, timing, and setting so we can prepare for a thoughtful first conversation.",quote:"Every memorable gathering begins with a good conversation.",items:[[CalendarDays,"30-minute consultation","A focused conversation about your event."],[ClipboardCheck,"Custom proposal","Prepared after we understand your needs."],[UsersRound,"One caring team","Clear support from planning to delivery."]]},
} as const;

export default function ConsultationSection({googleBookingUrl,variant="general",id="consultation",editableCopy,onEditCopy}:{googleBookingUrl?:string;variant?:Variant;id?:string;editableCopy?:Record<string,string>;onEditCopy?:(field:string,value:string)=>void}){
  const value=content[variant];
  const prefix=variant==="general"?"generalConsult":variant==="companionship"?"companionshipConsult":"eventConsult";
  const edit=(field:string,fallback:string,multiline=false)=>editableCopy&&onEditCopy?<EditableText value={editableCopy[`${prefix}${field}`]??fallback} label={`${variant} consultation ${field}`} onChange={next=>onEditCopy(`${prefix}${field}`,next)} multiline={multiline} maxLength={multiline?700:180}/>:fallback;
  return <section id={id} className={styles.consultation} aria-labelledby={`${id}-heading`}>
    <div className={styles.consultationIntro}><p className={styles.eyebrow}>{edit("Eyebrow",value.eyebrow)}</p><h2 id={`${id}-heading`}>{edit("Title",value.title)}</h2><p>{edit("Description",value.description,true)}</p><ul>{value.items.map(([Icon,title,text],index)=><li key={index}><Icon aria-hidden="true"/><span><strong>{edit(`Item${index+1}Title`,title)}</strong><small>{edit(`Item${index+1}Text`,text,true)}</small></span></li>)}</ul><blockquote>{edit("Quote",value.quote,true)}</blockquote><p className={styles.values}>{editableCopy&&onEditCopy?<EditableText value={editableCopy.consultationValues} label="consultation values" onChange={next=>onEditCopy("consultationValues",next)} maxLength={100}/>:"People • Purpose • Progress"}</p></div>
    <ConsultationPlanner googleBookingUrl={googleBookingUrl} initialType={variant==="event"?"event":"companionship"}/>
  </section>;
}
