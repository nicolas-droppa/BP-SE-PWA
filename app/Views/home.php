<?php
$pageTitle = 'MyAimBuddy | Evaluation';
$includeScripts = [
    ['src' => './scripts/script.js',           'module' => true],
    ['src' => './scripts/handlers/selectionHandler.js', 'module' => true],
    ['src' => './scripts/design/navbar.js',  'module' => false],
];
require __DIR__ . '/layouts/header.php';
require __DIR__ . '/layouts/navigation.php';
?>

<h2>Evaluate Your Shooting Accuracy</h2>
<p id="status">Loading OpenCV.js...</p>

<div class="upload-box" id="uploadBox">
    <div class="upload-text" id="uploadPlaceholder">
        <i class="fa-regular fa-file"></i>
        <h1>Click to upload an image</h1>
        <span>Evaluate any PNG or JPG target image</span>
    </div>

    <div class="loading-spinner" id="loadingSpinner" style="display:none;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size:48px;"></i>
        <h2>Processing image...</h2>
    </div>

    <div class="content-area" id="contentArea" style="display:none;">
        <div class="canvas-area">
            <div class="top-bar">
                <button id="resetBtn">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <button id="saveBtn">
                    <i class="fa-regular fa-floppy-disk"></i>
                </button>
            </div>

            <div class="canvas-scroll">
                <canvas id="warpCanvas"></canvas>
            </div>
        </div>
            
        <div class="control-panel">
            <div class="title">
                <h2>Current points</h2>
            </div>
            <div class="current-points">
                
            </div>

            <div class="brush-control">
                <label for="brushSize">
                    <span id="brushSizeValue">5</span>
                </label>
                <input type="range" id="brushSize" min="1" max="50" value="5"/>
            </div>

            <div class="buttons">
                <button id="undoBtn">
                    <i class="fa-solid fa-arrow-rotate-left"></i> Undo
                </button>
                <button id="redoBtn">
                    <i class="fa-solid fa-arrow-rotate-right"></i> Redo
                </button>
            </div>
            <button id="doneSelectionBtn" style="display: none;">Done</button>
        </div>
    </div>

    <input type="file" id="fileInput" accept="image/*" hidden>
</div>        

<?php
require __DIR__ . '/layouts/footer.php';