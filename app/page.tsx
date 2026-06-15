import { LANDING_HTML } from "@/lib/landingHtml";

export default function Landing() {
  return <div className="land" dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />;
}
