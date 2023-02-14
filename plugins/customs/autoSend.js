import cron from 'node-cron'

// learn more about cron time here:
// https://www.npmjs.com/package/node-cron?activeTab=readme
const jobs = [
    {
        time: "0 22 * * *", // every day at 22:00 (10 PM)
        message: () => "It's 10 PM, good night!",
    },
    {
        time: "21 22 * * *", // every day at 22:21 (10:21 PM)
        message: () => "It's 10:21 PM, good night!",
        targetIDs: ["100008907121641"] // list of ids that bot will send to, remove this to send to all group
    }
]

export default function autoSend() {
    cron.getTasks().forEach(task => task.stop());

    const timezone = global.config?.timezone || "Asia/Ho_Chi_Minh";
    if (!timezone) return;

    for (const job of jobs) {
        cron.schedule(job.time, () => {
            let i = 0;
            for (const tid of job.targetIDs || Array.from(global.data.threads.keys()) || []) {
                setTimeout(() => {
                    global.api.sendMessage({
                        body: job.message()
                    }, tid);
                }, (i++) * 300)
            }
        }, {
            timezone: timezone
        })
    }

    cron.schedule("0 0 * * *", async () => {
        const allDATA = global.checktt_cache;

        if (!allDATA) return;

        for (const [tid, data] of allDATA) {
            const _DAYDATA = data.day.sort((a, b) => b.n - a.n);

            if (!_DAYDATA) continue;

            let msg = "📊 Thống kê TOP 10 ngày hôm qua:\n";

            for (let i = 0; i < _DAYDATA.length; i++) {
                let username = (await global.controllers.Users.getName(_DAYDATA[i].id)) || "Người dùng Facebook";
                msg += `\n${i + 1}. ${username} - ${_DAYDATA[i].n}`;
            }

            global.checktt_cache.set(tid, {
                day: [],
                week: data.week,
                all: data.all
            })
            global.api.sendMessage(msg, tid);

            global.sleep(300);
        }
    }, {
        timezone: timezone
    })

    cron.schedule("0 0 * * 1", async () => {

        const allDATA = global.checktt_cache;

        if (!allDATA) return;

        for (const [tid, data] of allDATA) {
            global.checktt_cache.set(tid, {
                day: [],
                week: [],
                all: data.all
            })
        }
    }, {
        timezone: timezone
    })
}
