async function parseAndSendSubmission()
{
	let source = "Unknown";
	let payload = {};
	const url = document.location.href;

	if (url.includes("codeforces.com") && url.includes("/submission/"))
	{
		source = "Codeforces";
	} else if ((url.includes("luogu.com.cn") || url.includes("luogu.com")) && url.includes("/record/"))
	{
		source = "Luogu";
	} else if (url.includes("atcoder.jp"))
	{
		source = "AtCoder";
	}

	// 异步获取存储的用户名数据
	const storedData = await chrome.storage.local.get(['codeforcesUsername', 'luoguUsername']);
	const cfUsername = storedData.codeforcesUsername;
	const lgUsername = storedData.luoguUsername;

	if (source === "Codeforces")
	{
		const codeElement = document.querySelector("pre");
		const row = document.querySelector("tr.highlighted-row");
		if (codeElement && row)
		{
			const cells = row.querySelectorAll("td");
			const submitterName = cells[1].innerText.substring(10);

			if (submitterName === cfUsername)
			{
				const codeText = codeElement.innerText;
				const submissionId = "CF" + parseInt(cells[0].innerText);
				const problemId = cells[2].innerText.split(" - ")[0].trim(); // 舍弃problem version信息
				const verdict = (cells[4].innerText) === "Accepted" ? "Accepted" : "UnAccepted";
				const score = verdict === "Accepted" ? 100 : 0;
				const submissionTime = (new Date(cells[7].innerText.replace(" ", "T") + "+03:00")).toLocaleString(); // ISO 8601 UTC+3
				if (!(verdict.includes("Running")))
				{
					payload =
					{
						source: source,
						code: codeText,
						submissionId: submissionId,
						problemId: problemId,
						verdict: verdict,
						score: score,
						submissionTime: submissionTime
					};
				}
			}
		}
	}

	if (source === "Luogu")
	{
		const dataElement = document.querySelector("#lentille-context");
		if (dataElement)
		{
			const data = JSON.parse(dataElement.textContent).data.record;
			if (data.user.name === lgUsername)
			{
				const codeText = data.sourceCode;
				const submissionId = "LG" + data.id;
				const problemId = data.problem.pid;
				const score = data.score;
				const verdict = (data.problem.fullScore === score) ? "Accepted" : "UnAccepted";
				const submissionTime = (new Date(data.submitTime * 1000)).toLocaleString();

				payload = {
					source: source,
					code: codeText,
					submissionId: submissionId,
					problemId: problemId,
					verdict: verdict,
					score: score,
					submissionTime: submissionTime
				};
			}
		}
	}

	if (payload.code)
	{
		chrome.runtime.sendMessage(payload);
	}
}

parseAndSendSubmission();