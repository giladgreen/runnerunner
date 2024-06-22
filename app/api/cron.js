export default function handler(req, res) {
    console.error('Cron job is running!')
    res.status(200).end('Hello Cron!');
}
