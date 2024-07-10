
import {fetchPlayersPrizes} from '@/app/lib/data';
import {Card, getPlayersPrizesContent} from "@/app/ui/dashboard/cards";

export default async function PrizesPage() {
    const { undeliveredPrizes, deliveredPrizes}= await fetchPlayersPrizes();
    console.log('undeliveredPrizes', undeliveredPrizes)
    console.log('deliveredPrizes', deliveredPrizes)
    const undeliveredPrizesContent = await getPlayersPrizesContent(undeliveredPrizes,  false) as JSX.Element;
    const deliveredPrizesContent = await getPlayersPrizesContent(deliveredPrizes,  false) as JSX.Element;
    if (!undeliveredPrizesContent && !deliveredPrizesContent){
        return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1 full-width"
                    style={{marginBottom: 10, marginTop: -20}}>
           No Data
        </div>
    }


    return <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-1 full-width"
                style={{marginBottom: 10, marginTop: -20}}>
        {undeliveredPrizesContent && <Card title="Players Undelivered Prizes" value={undeliveredPrizesContent} type="prize"/>}
        {deliveredPrizesContent && <Card title="Players Prizes History (Delivered)" value={deliveredPrizesContent} type="prize"/>}
    </div>
}
