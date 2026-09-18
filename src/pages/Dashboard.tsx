import { PasswordOverview } from "../components/PasswordOverview";
import { ScrollableMenu } from "../components/ScrollableMenu";

export function Dashboard() {
    return (
        <div>
            <ScrollableMenu />
            <PasswordOverview />
        </div>
    );
}
