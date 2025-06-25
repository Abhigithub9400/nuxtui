<template>
    <div>
        <NuxtPage />
    </div>
</template>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

    body {
        font-family: "Inter", sans-serif;
        font-style: normal;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }

        body.no-scroll {
            overflow: hidden;
        }

    #app {
        position: relative;
    }

    .offline-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        pointer-events: all;
    }
</style>