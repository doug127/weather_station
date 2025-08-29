import { Card } from "./card/Card"

export const KPIs = () => {
    return(
        <div>
            <div className="grid lg:gap-20 md:gap-4 gap-1 p-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">

                <Card icon="fa-camera-retro" title="Today's" value="56k" percentage="55%" />

                <Card icon="fa-user-group" title="Today's" value="56k" percentage="55%" />

                <Card icon="fa-user-plus" title="Today's" value="56k" percentage="55%" />

            </div>
        </div>
    )
}