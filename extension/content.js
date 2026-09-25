const codeElement = document.querySelector("pre");
const row = document.querySelector("tr.highlighted-row");
if (codeElement && row)
{
	const codeText = codeElement.innerText;
	const cells = row.querySelectorAll("td");
	const submissionId = cells[0].innerText;
	const problemId = cells[2].innerText.split(" - ")[0].trim(); // 舍弃problem version信息
	const verdict = cells[4].innerText;
	const submissionTime = cells[7].innerText;
	const payload =
	{
		code: codeText,
		submissionId: submissionId,
		problemId: problemId,
		verdict: verdict,
		submissionTime: submissionTime
	}
	chrome.runtime.sendMessage(payload);
}
