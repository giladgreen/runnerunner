import {removeOldRsvp} from "../lib/actions";

export default function handler(req, res) {
    removeOldRsvp().then(() => {
        res.status(200).end('removed old rsvps');
    }).catch((err) => {
        console.log('error removing old rsvps', err);
        res.status(500).end('error removing old rsvps');
    });

}
