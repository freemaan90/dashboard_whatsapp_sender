import { getSessions } from "./actions/getSessions";
import { ClientComponent } from "./components/ClientComponent";

export default async function Home() {
  const sessions = await getSessions();
  return (
    <div>
      <div>
        <ClientComponent session={sessions} telNumber={'5493413646222'} />
      </div>
      <div>
        <ClientComponent session={sessions} telNumber={'5491151136431'}/>
      </div>
    </div>
  );
}
