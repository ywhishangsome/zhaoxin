<template>
    <section class="hero">
        <div class="hero-content">
            <h1 class="headline">探索你的精彩校园生活</h1>
            <p class="subtext">加入 200 多个活跃社团，在 CampusConnect 开启一段难忘的成长之旅。</p>
        </div>
        <div class="decorative-elements">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
        </div>
    </section>
</template>

<style lang="less" scoped>
.hero {
    position: relative;
    background: linear-gradient(135deg, #0058bb 0%, #6c9fff 100%);
    border-radius: 24px;
    padding-left: 20px;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 20px;

    .hero-content {
        position: relative;
        z-index: 10;

        .headline {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: #f0f2ff;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }

        .subtext {
            font-size: 14px;
            color: rgba(240, 242, 255, 0.9);
            max-width: 600px;
            line-height: 1.5;
        }
    }

    .decorative-elements {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        pointer-events: none;
        opacity: 0.2;

        .circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
        }

        .circle-1 {
            width: 256px;
            height: 256px;
            background: white;
            top: -40px;
            right: -40px;
        }

        .circle-2 {
            width: 192px;
            height: 192px;
            background: #e0f4fd;
            bottom: 0;
            right: 80px;
        }
    }
}
</style>
