import { getSessions } from "./actions/getSessions";
import { ClientComponent } from "./components/ClientComponent";

export default async function Home() {
  const sessions = await  getSessions()
  return <ClientComponent session={sessions}/>
}
