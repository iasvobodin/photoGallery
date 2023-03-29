<!-- <p>
	Мой стиль фотографии основан на естественности, я стремлюсь отразить жизнь и эмоции в моих
	фотографиях. Я люблю работать с людьми и понимать их потребности, чтобы создавать индивидуальные и
	неповторимые фотографии.
</p>
<p>
	Моя основная специализация - портретная съемка. Я умею создавать атмосферу доверия и комфорта,
	чтобы люди чувствовали себя свободно перед камерой. Я стараюсь отразить индивидуальность каждого
	человека, чтобы фотографии были выразительными и запоминающимися.
</p>
<p>
	Кроме того, я также занимаюсь репортажной съемкой, фиксируя важные моменты в жизни моих клиентов.
	Я умею находить интересные ракурсы и моменты, чтобы создать живые и эмоциональные фотографии.
</p>
<p>
	Если Вы ищете профессионального фотографа, который сможет создать неповторимые и выразительные
	фотографии, то Вы нашли его. Я готов работать с Вами, чтобы создать индивидуальный и
	запоминающийся результат, который будет радовать Вас на протяжении многих лет. Свяжитесь со мной,
	и мы обсудим детали Вашей фотосессии и найдем лучший подход к ее осуществлению. Благодарю за Ваш
	выбор!
</p> -->
<script>
	let social = [
			'instagram.com/svobodinaphoto',
			'vk.com/svobodinaphoto',
			't.me/svobodinaphoto',
			'Позвонить'
		],
		count = 1,
		link = [
			'https://www.instagram.com/svobodinaphoto/',
			'https://vk.com/svobodinaphoto',
			'https://t.me/svobodinaphoto',
			'tel:+79514616243'
		];
	// import '$lib/page.css';
</script>

<svelte:head>
	<title>О себе</title>
</svelte:head>
<h1 class="main__head rotate">О себе</h1>
<div class="about-main">
	<div class="part1">
		<div class="about-video">
			<video
				autoplay
				muted
				loop
				crossorigin="anonimous"
				src="https://photoday.svobodinaphoto.store/G1.mp4"
				><track kind="captions" />
			</video>
		</div>
		<div class="decs desc1">
			<p>
				Здравствуйте! Меня зовут Анастасия, рада приветствовать Вас на моём сайте. Я
				профессиональный фотограф с многолетним опытом работы в области портретной и репортажной
				съемки.
			</p>
		</div>
	</div>
	<div class="part2">
		<div class=" desc21">
			<p>
				Мой стиль фотографии основан на естественности, я стремлюсь отразить жизнь и эмоции в моих
				фотографиях. Я люблю работать с людьми и понимать их потребности, чтобы создавать
				индивидуальные и неповторимые фотографии.
			</p>
		</div>
		<div class="part21">
			<div class=" desc22">
				<p>
					Я умею создавать атмосферу доверия и комфорта, чтобы люди чувствовали себя свободно перед
					камерой. Я стараюсь отразить индивидуальность каждого человека, чтобы фотографии были
					выразительными и запоминающимися.
				</p>
			</div>
			<div class="about-video2">
				<video
					autoplay
					muted
					loop
					crossorigin="anonimous"
					src="https://photoday.svobodinaphoto.store/V1.mp4"
					><track kind="captions" />
				</video>
			</div>
		</div>
	</div>
	<div class="decs desc-middle">
		<p>
			Если Вы ищете профессионального фотографа, который сможет создать неповторимые и выразительные
			фотографии, то Вы нашли его.
		</p>
	</div>
	<div class="part1 final">
		<div class="decs desc3">
			<p>
				Я готова работать с Вами, чтобы создать индивидуальный и запоминающийся результат, который
				будет радовать Вас на протяжении многих лет. Свяжитесь со мной, и мы обсудим детали Вашей
				фотосессии и найдем лучший подход к ее осуществлению. Благодарю за Ваш выбор!
			</p>
		</div>
		<div class="about-video">
			<video
				autoplay
				muted
				loop
				crossorigin="anonimous"
				src="https://photoday.svobodinaphoto.store/G2.mp4"
				><track kind="captions" />
			</video>
		</div>
	</div>
	<div class="contact">
		<!-- <h2 class="description date">Контакты</h2> -->
		<a class="description3" href={link[count]} rel="noopener" target="_blank">
			<p>{social[count]}</p>
		</a>
	</div>
</div>

<style>
	.description3 {
		font-size: max(24px, 5vw);
		margin: 0;
	}
	.contact {
		width: 98%;
	}

	a {
		text-decoration: none;
		color: rgb(255, 255, 255);
		width: 100%;
		text-align: right;
	}
	a:hover {
		color: rgb(165, 0, 165);
	}
	.decs {
		font-size: clamp(16px, 16px + 0.8vw, 30px);
		mix-blend-mode: difference;
		width: max(30vw, 300px);
		padding: 0px 1vw;
	}
	.final {
		/* padding-bottom: 10vw; */
	}
	p {
		text-indent: 3ch;
		margin: 0;
		padding: 2vh 0px;
	}
	.part1 {
		/* container-name: part1; */
		width: 90vw;
		margin-top: 5vh;
		display: flex;
		flex-wrap: wrap-reverse;
		/* align-items: flex-start; */
		margin: auto;
	}
	.part2 {
		width: 96vw;
		align-items: center;
		display: flex;
		column-gap: 2vw;
		margin: auto;
		/* flex-direction: row; */
		flex-wrap: wrap;
	}
	.desc21 {
		font-size: clamp(16px, 16px + 0.8vw, 30px);
		/* flex-shrink: 1; */
		/* width: 30vw; */
		flex: 1 1 300px;
		/* margin-top: 2vw; */
		/* align-self: start; */
	}

	.part21 {
		/* flex-shrink: 1; */
		/* flex: 1 1 600px; */
		/* width: 62vw; */
		flex-wrap: wrap;
		column-gap: 2vw;
		row-gap: 2vh;
		flex: 2 1 600px;
		align-items: center;
		display: flex;
		/* flex-wrap: wrap; */
		margin: auto;
	}
	.desc22 {
		font-size: clamp(16px, 16px + 0.8vw, 30px);
		/* width: 30vw; */
		flex: 1 1 300px;
		/* flex: 1 1 300px; */
		/* margin-bottom: 2vw; */
		/* align-self: end; */
	}

	.about-video2 {
		/* width: 30vw; */
		flex: 1 1 300px;
		align-self: center;
		aspect-ratio: 0.5625;
		overflow: hidden;
		/* margin-left: 1vw; */
		/* margin-top: -10vh; */
		border-radius: 5px;
	}

	.about-video {
		flex: 3 1 650px;
		align-self: center;
		width: 60vw;
		aspect-ratio: 1.83;
		overflow: hidden;
		margin-left: 1vw;
		/* margin-right: min(10px, -15vw); */
		border-radius: 5px;
	}
	.desc1 {
		flex: 1 1 30%;
		place-self: center;
		/* margin-top: -5vh; */
		/* margin-left: -15vw; */
	}
	/* @container (min-width: 300px) {
		.desc1 {
			margin-top: 0px;
			margin-left: 0px;
		}
	} */
	/* .desc21 {
		flex: 1 1 300px;
		margin-top: 2vw;
		align-self: start;
	}
	.desc22 {
		flex: 1 1 300px;
		margin-bottom: 2vw;
		align-self: end;
	} */
	.desc-middle {
		margin: 10vw auto;
		width: min(96vw, 900px);
		font-size: clamp(20px, 20px + 1.5vw, 40px);
	}
	.desc3 {
		place-self: center;
		/* margin-right: -15vw; */
		flex: 1 1 300px;
	}

	.about-main {
		width: 100%;
		display: grid;
		row-gap: 5vh;
		/* grid-template-columns: 60vw 1fr; */
	}

	/* .about-video2 {
		flex: 1 1 300px;
		align-self: center;
		width: 30vw;
		aspect-ratio: 0.5625;
		overflow: hidden;
		margin-left: 1vw;
		border-radius: 5px;
	} */
	video {
		margin-top: -2.5%;
		width: 100%;
		height: 110%;
		object-fit: cover;
		object-position: center;
	}
</style>
