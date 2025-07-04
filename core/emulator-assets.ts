export const VIRTUAL_SECTORFORTH_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>File Decoder for Sectorforth Emulator</title>
    <script src="pako_inflate.min.js"></script>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            margin: 20px;
            background-color: #1e1e1e;
            color: #d4d4d4;
        }
        #main-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        #emulator-column {
            flex: 2;
            min-width: 640px;
        }
        #reference-column {
            flex: 1;
            min-width: 300px;
        }
        h1, h2 {
            color: #569cd6;
        }
        #emulator-container {
            border: 1px solid #333;
            margin-bottom: 20px;
        }
        #screen_container {
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 480px;
        }
        #reference-panel {
            border: 1px solid #333;
            padding: 15px;
            background-color: #252526;
            height: calc(100vh - 100px);
            overflow-y: auto;
        }
        #reference-panel h1, #reference-panel h2, #reference-panel h3 {
            font-size: 1.5rem;
            color: #569cd6;
            border-bottom: 1px solid #333;
            padding-bottom: 0.5rem;
            margin-top: 0;
        }
        #reference-panel h3 {
            font-size: 1.3rem;
            color: #4ec9b0;
            margin-top: 1.5rem;
        }
        .command-item {
            margin-bottom: 1rem;
            position: relative;
            background: #2a2a2e;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 0.75rem;
        }
        .command-item h4 {
            font-size: 1.1rem;
            color: #9cdcfe;
            margin: 0 0 0.5rem 0;
            padding-right: 60px; /* Space for copy button */
        }
        .command-item p {
            font-size: 0.9em;
            color: #cccccc;
            margin: 0;
        }
        code {
            background: #1e1e1e;
            color: #ce9178;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #3c3c3c;
            border: 1px solid #555;
            color: #ccc;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
        }
        .copy-btn:hover {
            background: #4f4f4f;
        }
        .copy-btn.copied {
            background: #569cd6;
            color: #fff;
        }
        .manual-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
            font-size: 0.9em;
        }
        .manual-table th, .manual-table td {
            border: 1px solid #3c3c3c;
            padding: 8px;
            text-align: left;
        }
        .manual-table th {
            background-color: #2a2a2e;
            color: #9cdcfe;
        }
        .var-list {
            list-style-type: none;
            padding-left: 0;
        }
        .var-list li {
            background: #2a2a2e;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
        }
        .stack-effect {
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: #b5cea8;
            font-weight: normal;
        }
        .code-block {
            position: relative;
            background: #1e1e1e;
            padding: 10px;
            border-radius: 4px;
            margin-top: 0.5rem;
        }
        .code-block code {
            white-space: pre-wrap;
            padding: 0;
            background: none;
            display: block;
            padding-right: 60px; /* Space for copy button */
        }
        .code-block .copy-btn {
            position: absolute;
            top: 5px;
            right: 5px;
        }
    </style>
    <script>
    "use strict";

    window.startEmulator = function(blobs) {
        if (typeof V86Starter === "undefined") {
            console.error("V86Starter is not defined. Ensure libv86.js is loaded.");
            return;
        }

        var emulator = new V86Starter({
            memory_size: 1024 * 1024 * 1024,
            vga_memory_size: 2 * 1024 * 1024,
            screen_container: document.getElementById("screen_container"),
            bios: { url: blobs["seabios.bin"] },
            vga_bios: { url: blobs["vgabios.bin"] },
            fda: { url: blobs["sectorforth.img"] },
            autostart: true,
        });
    };

    function copyText(button, text) {
        if (!navigator.clipboard) {
            return;
        }
        // Replace escaped newline with actual newline for clipboard
        const textToCopy = text.replace(/\\\\n/g, '\\n');
        navigator.clipboard.writeText(textToCopy).then(function() {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(function() {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }
    </script>
</head>
<body>
    <div id="main-container">
        <div id="emulator-column">
            <h1>Decode and Run Sectorforth</h1>
            <div id="emulator-container">
                <div id="screen_container">
                    <div style="white-space: pre; font: 14px monospace; line-height: 14px"></div>
                    <canvas style="display: none"></canvas>
                </div>
            </div>
        </div>
        <div id="reference-column">
            <div id="reference-panel">
                <h2>Sectorforth Reference</h2>

                <h3>Core Primitives</h3>
                <table class="manual-table">
                    <thead><tr><th>Primitive</th><th>Stack Effect</th><th>Description</th></tr></thead>
                    <tbody>
                        <tr><td><code>@</code></td><td>( addr -- x )</td><td>Fetch 16-bit value from memory.</td></tr>
                        <tr><td><code>!</code></td><td>( x addr -- )</td><td>Store 16-bit value at memory.</td></tr>
                        <tr><td><code>sp@</code></td><td>( -- sp )</td><td>Get data stack pointer address.</td></tr>
                        <tr><td><code>rp@</code></td><td>( -- rp )</td><td>Get return stack pointer address.</td></tr>
                        <tr><td><code>0=</code></td><td>( x -- flag )</td><td>True (-1) if x is 0, else false (0).</td></tr>
                        <tr><td><code>+</code></td><td>( x y -- z )</td><td>Adds x and y.</td></tr>
                        <tr><td><code>nand</code></td><td>( x y -- z )</td><td>Bitwise NAND of x and y.</td></tr>
                        <tr><td><code>exit</code></td><td>(R: addr -- )</td><td>Ends word definition, returns to caller.</td></tr>
                        <tr><td><code>key</code></td><td>( -- char )</td><td>Reads a single keystroke.</td></tr>
                        <tr><td><code>emit</code></td><td>( char -- )</td><td>Prints ASCII character.</td></tr>
                    </tbody>
                </table>

                <h3>System Variables</h3>
                <ul class="var-list">
                    <li><code>state</code>: Interpreter state (0=interpret, 1=compile).</li>
                    <li><code>tib</code>: Terminal Input Buffer address.</li>
                    <li><code>&gt;in</code>: Offset into the TIB for parsing.</li>
                    <li><code>here</code>: Pointer to next available dictionary space.</li>
                    <li><code>latest</code>: Pointer to the most recent word definition.</li>
                </ul>

                <h3>Common Forth Words</h3>
                <p>Paste these definitions into the emulator to build up functionality.</p>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': DUP SP@ @ ;')">Copy</button>DUP <span class="stack-effect">( x -- x x )</span></h4>
                    <p><code>: DUP SP@ @ ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': INVERT DUP NAND ;')">Copy</button>INVERT <span class="stack-effect">( x -- !x )</span></h4>
                    <p><code>: INVERT DUP NAND ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': -1 0 INVERT ;\\\\n: 1 -1 DUP + INVERT ;')">Copy</button>-1 and 1</h4>
                    <p><code>: -1 0 INVERT ;</code><br><code>: 1 -1 DUP + INVERT ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': NEGATE INVERT 1 + ;')">Copy</button>NEGATE <span class="stack-effect">( x -- -x )</span></h4>
                    <p><code>: NEGATE INVERT 1 + ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': 2 1 1 + ;\\\\n: 3 1 2 + ;\\\\n: 4 2 2 + ;\\\\n: 5 2 3 + ;\\\\n: 6 3 3 + ;')">Copy</button>Numbers 2 to 6</h4>
                    <p><code>: 2 1 1 + ;</code><br><code>: 3 1 2 + ;</code><br><code>: 4 2 2 + ;</code><br><code>: 5 2 3 + ;</code><br><code>: 6 3 3 + ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': OVER SP@ 2 + @ ;')">Copy</button>OVER <span class="stack-effect">( x y -- x y x )</span></h4>
                    <p><code>: OVER SP@ 2 + @ ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': DROP SP@ 2 + SP@ ! ;')">Copy</button>DROP <span class="stack-effect">( x -- )</span></h4>
                    <p><code>: DROP SP@ 2 + SP@ ! ;</code></p>
                </div>

                <div class="command-item">
                    <h4><button class="copy-btn" onclick="copyText(this, ': SWAP OVER OVER SP@ 6 + ! SP@ 2 + ! ;')">Copy</button>SWAP <span class="stack-effect">( x y -- y x )</span></h4>
                    <p><code>: SWAP OVER OVER SP@ 6 + ! SP@ 2 + ! ;</code></p>
                </div>
            </div>
        </div>
    </div>
    <script>
        var blobs = {};

        function isGzipCompressed(data) {
            return data[0] === 0x1F && data[1] === 0x8B;
        }

        function base64ToBlob(base64Data) {
            let standardBase64 = base64Data.replace(/-/g, '+').replace(/_/g, '/');
            while (standardBase64.length % 4 !== 0) {
                standardBase64 += '=';
            }
            try {
                const byteCharacters = atob(standardBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

                if (isGzipCompressed(byteArray)) {
                    return new Blob([pako.inflate(byteArray)]);
                }
                return new Blob([byteArray]);
            } catch (e) {
                console.error("Error in base64 decoding: ", e);
                return null;
            }
        }

        function appendScriptToDocument(blob, fileName) {
            if (fileName.endsWith('.js') || fileName.endsWith('.wasm')) {
                var script = document.createElement('script');
                script.src = URL.createObjectURL(blob);
                document.head.appendChild(script);

                if (fileName === 'libv86.js') {
                    script.onload = function() {
                        if (window.startEmulator) {
                            window.startEmulator(blobs);
                        }
                    };
                }
            }
        }

        function appendFileToDocument(blob, fileName) {
            var url = window.URL.createObjectURL(blob);
            blobs[fileName] = url;
            console.log(\`File: \${fileName}, Blob URL: \${url}, Size: \${blob.size}, Type: \${blob.type}\`);
        }

        function loadEmulator() {
            if (window.startEmulator) {
                window.startEmulator(blobs);
            }
        }

        function processDataFromChunkyHTML(htmlContent) {
            console.log("Processing HTML content");

            const scriptContentMatch = htmlContent.match(/<script>([\\s\\S]*?)<\\/script>/);
            if (!scriptContentMatch) {
                console.error("No script with JSON data found");
                return;
            }

            const scriptContent = scriptContentMatch[1];
            const jsonDataMatches = scriptContent.match(/data \\+= \`([\\s\\S]*?)\`;/g);
            if (!jsonDataMatches) {
                console.error("No JSON data found in script");
                return;
            }

            let sortedChunks = [];
            jsonDataMatches.forEach((jsonDataMatch) => {
                const jsonData = jsonDataMatch.match(/data \\+= \`([\\s\\S]*?)\`;/)[1].trim();
                try {
                    const json = JSON.parse(jsonData);
                    if (json && json.content && json.content.chunk && typeof json.content.chunk === 'string') {
                        sortedChunks.push({ file: json.file, chunk: json.content.chunk, number: json.number });
                    }
                } catch (e) {
                    console.error("Error parsing JSON chunk", e);
                }
            });
            sortedChunks.sort((a, b) => a.number - b.number);

            sortedChunks.forEach((chunk) => {
                const fileIdentifier = chunk.file;
                if (!blobs[fileIdentifier]) {
                    blobs[fileIdentifier] = '';
                }
                blobs[fileIdentifier] += chunk.chunk;
            });

            for (const [fileIdentifier, base64Data] of Object.entries(blobs)) {
                const blob = base64ToBlob(base64Data);
                if (blob) {
                    blobs[fileIdentifier] = blob;
                    appendFileToDocument(blob, fileIdentifier);
                    if (fileIdentifier === "libv86.js") {
                        appendScriptToDocument(blob, fileIdentifier);
                    }
                }
            }
        }

        // The DOMContentLoaded listener that fetches 'chunky-sectorforth.html' and processes it is removed.
        // Asset loading will now be handled by the parent window sending blob URLs via postMessage.
        // The window.addEventListener('message', ...) in public/start-sectorforth.html (derived from this template)
        // will handle these messages.
    </script>
</body>
</html>
`;

export const VIRTUAL_FREEDOS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>File Decoder for Freedos Emulator</title>
    <script src="pako_inflate.min.js"></script>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            margin: 20px;
            background-color: #1e1e1e;
            color: #d4d4d4;
        }
        #emulator-container {
            border: 1px solid #333;
            margin-bottom: 20px;
        }
        #screen_container {
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px; /* Adjust as needed */
        }
        #reference-panel {
            border: 1px solid #333;
            padding: 15px;
            background-color: #252526;
        }
        #reference-panel h1 {
            font-size: 1.5rem;
            color: #569cd6;
            border-bottom: 1px solid #333;
            padding-bottom: 0.5rem;
            margin-top: 0;
        }
        .command-item {
            margin-bottom: 1rem;
            position: relative;
            background: #2a2a2e;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 0.75rem;
        }
        .command-item h4 {
            font-size: 1.1rem;
            color: #9cdcfe;
            margin: 0 0 0.5rem 0;
            padding-right: 60px; /* Space for copy button */
        }
        .command-item p {
            font-size: 0.9em;
            color: #cccccc;
            margin: 0;
        }
        .command-item code {
            background: #1e1e1e;
            color: #ce9178;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #3c3c3c;
            border: 1px solid #555;
            color: #ccc;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
        }
        .copy-btn:hover {
            background: #4f4f4f;
        }
        .copy-btn.copied {
            background: #569cd6;
            color: #fff;
        }
    </style>
    <script>
    "use strict";

    window.startEmulator = function(blobs) {
        if (typeof V86Starter === "undefined") {
            console.error("V86Starter is not defined. Ensure libv86.js is loaded.");
            return;
        }

        var emulator = new V86Starter({
            memory_size: 32 * 1024 * 1024,
            vga_memory_size: 2 * 1024 * 1024,
            screen_container: document.getElementById("screen_container"),
            bios: {
                url: blobs["seabios.bin"],
            },
            vga_bios: {
                url: blobs["vgabios.bin"],
            },
            fda: {
                url: blobs["freedos.boot.disk.160K.img"],
            },
            autostart: true,
        });
    };

    function copyText(button, text) {
        if (!navigator.clipboard) {
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(function() {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }
    </script>
</head>
<body>
    <h1>Decode Data from Chunky HTML</h1>
    <div id="start_emulation"></div>
    <div id="emulator-container">
        <div id="screen_container">
            <div style="white-space: pre; font: 14px monospace; line-height: 14px"></div>
            <canvas style="display: none"></canvas>
        </div>
    </div>
    <div id="reference-panel">
        <h1>Common FreeDOS Commands</h1>

        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'DIR')">Copy</button>DIR</h4><p>Lists files and directories. <br>Usage: <code>DIR [/?]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'CD ')">Copy</button>CD</h4><p>Changes the current directory. <br>Usage: <code>CD [directory]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'MD ')">Copy</button>MD / MKDIR</h4><p>Creates a new directory. <br>Usage: <code>MD [directory]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'RD ')">Copy</button>RD / RMDIR</h4><p>Removes a directory. <br>Usage: <code>RD [directory]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'DEL ')">Copy</button>DEL / ERASE</h4><p>Deletes a file. <br>Usage: <code>DEL [file]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'COPY ')">Copy</button>COPY</h4><p>Copies files. <br>Usage: <code>COPY [source] [dest]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'XCOPY ')">Copy</button>XCOPY</h4><p>Extended copy for directories. <br>Usage: <code>XCOPY [source] [dest]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'MOVE ')">Copy</button>MOVE</h4><p>Moves files or directories. <br>Usage: <code>MOVE [source] [dest]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'TYPE ')">Copy</button>TYPE</h4><p>Displays file contents. <br>Usage: <code>TYPE [file]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'EDIT')">Copy</button>EDIT</h4><p>Opens a basic text editor. <br>Usage: <code>EDIT [file]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'MEM')">Copy</button>MEM</h4><p>Displays memory usage.</p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'CLS')">Copy</button>CLS</h4><p>Clears the screen.</p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'ECHO ')">Copy</button>ECHO</h4><p>Displays a message. <br>Usage: <code>ECHO [message]</code></p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'SET')">Copy</button>SET</h4><p>Manages environment variables.</p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'PATH')">Copy</button>PATH</h4><p>Sets executable search path.</p></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'EXIT')">Copy</button>EXIT</h4><p>Exits the command shell.</p></div>

        <h1>Files on Disk</h1>

        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'AUTOEXEC.BAT')">Copy</button>AUTOEXEC.BAT</h4></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'COMMAND.COM')">Copy</button>COMMAND.COM</h4></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'CONFIG.SYS')">Copy</button>CONFIG.SYS</h4></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'KERNEL.SYS')">Copy</button>KERNEL.SYS</h4></div>
        <div class="command-item"><h4><button class="copy-btn" onclick="copyText(this, 'README.TXT')">Copy</button>README.TXT</h4></div>
    </div>
    <script>
        // The DOMContentLoaded listener that fetches 'chunky-freedos.html' and processes it is removed.
        // Asset loading will now be handled by the parent window sending blob URLs via postMessage.
        // The window.addEventListener('message', ...) in public/start-freedos.html (derived from this template)
        // will handle these messages.
    </script>
</body>
</html>
`;
