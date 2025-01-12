import React from "react";
import {run} from "../ai";
import Markdown from "react-markdown";

export default function Main() {
    const [userInput, setUserInput] = React.useState("");
    const [summary, setSummary] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);

    function getFormData(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const textbox = formData.get("textbox");
        getResponse(textbox);
    }

    async function getResponse(textboxValue) {
        setLoading(true);
        setUserInput(textboxValue);
        try {
            const responseMarkdown = await run(textboxValue);
            setSummary(responseMarkdown);
        } catch (err) {
            console.error(err);
            setSummary("Error generating summary");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="main-container">
                <form className="form-container" onSubmit={getFormData}>
                    <label id="input-label" htmlFor="textbox">
                        Enter Text or URL
                    </label>
                    <textarea
                        name="textbox"
                        id="textbox"
                        placeholder="Paste your text here or a enter URL here..."
                    />

                    <button id="summarize-button" disabled={isLoading}>
                        {isLoading ? "GENERATING..." : "Summarize This"}
                    </button>
                </form>

                {!isLoading && summary && (
                    <section className="summary-container">
                        <div className="summary">
                            <p id="generated-summary">Summary Generated</p>
                            {summary != "Error generating summary" ? null : (
                                <p id="summary-title">Generated Summary:</p>
                            )}
                            <div className="summary-box">
                                <Markdown>{summary}</Markdown>
                            </div>
                        </div>
                    </section>
                )}
            </section>
        </>
    );
}
