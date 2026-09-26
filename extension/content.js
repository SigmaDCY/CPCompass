let source = "Unknown";
let payload = {};
const url = document.location.href
if (url.includes("codeforces.com") && url.includes("/submission/"))
{
	source = "Codeforces";
}
else if ((url.includes("luogu.com.cn") || url.includes("luogu.com")) && url.includes("/record/"))
{
	source = "Luogu";
}
else if (url.includes("atcoder.jp"))
{
	source = "AtCoder";
}

if (source === "Codeforces")
{
	const codeElement = document.querySelector("pre");
	const row = document.querySelector("tr.highlighted-row");
	if (codeElement && row)
	{
		const codeText = codeElement.innerText;
		const cells = row.querySelectorAll("td");
		const submissionId = "CF" + parseInt(cells[0].innerText);
		const problemId = cells[2].innerText.split(" - ")[0].trim(); // 舍弃problem version信息
		const verdict = cells[4].innerText;
		const score = verdict === "Accepted" ? 100 : 0;
		const submissionTime = (new Date(cells[7].innerText.replace(" ", "T") + "+03:00")).toLocaleString; // ISO 8601 UTC+3
		payload =
		{
			source: source,
			code: codeText,
			submissionId: submissionId,
			problemId: problemId,
			verdict: verdict,
			score: score,
			submissionTime: submissionTime
		}
	}
}

if (source === "Luogu")
{
	const dataElement = document.querySelector("#lentille-context");
	if (dataElement)
	{
		const data = JSON.parse(dataElement.textContent).data.record;
		const codeText = data.sourceCode;
		const submissionId = "LG" + data.id;
		const problemId = data.problem.pid;
		const verdict = data.accepted ? "Accepted" : "UnAccepted";
		const score = data.score;
		const submissionTime = (new Date(data.submitTime * 1000)).toLocaleString();
		payload =
		{
			source: source,
			code: codeText,
			submissionId: submissionId,
			problemId: problemId,
			verdict: verdict,
			score: score,
			submissionTime: submissionTime
		}
	}
}
if (payload.source !== "Unknown")
{
	chrome.runtime.sendMessage(payload);
}