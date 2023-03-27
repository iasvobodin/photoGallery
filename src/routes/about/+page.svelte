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
	// import '$lib/page.css';
</script>

<h1 class="main__head rotate">О себе</h1>
<div class="about-main">
	<div class="part1">
		<div class="about-video">
			<video autoplay muted loop crossorigin="anonimous" src="/720.mp4"
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
		<div class="decs desc21">
			<p>
				Мой стиль фотографии основан на естественности, я стремлюсь отразить жизнь и эмоции в моих
				фотографиях. Я люблю работать с людьми и понимать их потребности, чтобы создавать
				индивидуальные и неповторимые фотографии.
			</p>
		</div>
		<div class="decs desc22">
			<p>
				Я умею создавать атмосферу доверия и комфорта, чтобы люди чувствовали себя свободно перед
				камерой. Я стараюсь отразить индивидуальность каждого человека, чтобы фотографии были
				выразительными и запоминающимися.
			</p>
		</div>
		<div class="about-video2">
			<video autoplay muted loop crossorigin="anonimous" src="/2.MP4"
				><track kind="captions" />
			</video>
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
			<video autoplay muted loop crossorigin="anonimous" src="/720-2.mp4"
				><track kind="captions" />
			</video>
		</div>
	</div>
	<!-- <div class="desc2">
		<p>
			Моя любовь к фотографии началась еще в детстве, когда я получила свой первый фотоаппарат. С
			тех пор я увлекаюсь фотографией и стремлюсь к постоянному развитию своих навыков и техники.
		</p>
	</div> -->
</div>

<style>
	.decs {
		font-size: clamp(16px, 16px + 0.8vw, 30px);
		mix-blend-mode: difference;
		width: max(30vw, 300px);
		padding: 0px 1vw;
	}
	.final {
		padding-bottom: 10vw;
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
		width: 90vw;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		margin: auto;
	}
	.desc1 {
		flex: 1 1 30%;
		place-self: center;
		/* margin-top: -5vh; */
		/* margin-left: -15vw; */
	}
	.about-video {
		flex: 1 1 60vw;
		align-self: center;
		/* width: 60vw; */
		aspect-ratio: 1.83;
		overflow: hidden;
		margin-left: 1vw;
		/* margin-right: min(10px, -15vw); */
		border-radius: 5px;
	}
	/* @container (min-width: 300px) {
		.desc1 {
			margin-top: 0px;
			margin-left: 0px;
		}
	} */
	.desc21 {
		flex: 1 1 30vw;
		margin-top: 2vw;
		align-self: start;
	}
	.desc22 {
		flex: 1 1 30vw;
		margin-bottom: 2vw;
		align-self: end;
	}
	.desc-middle {
		margin: 10vw auto;
		width: min(90vw, 700px);
		font-size: clamp(16px, 16px + 1.5vw, 30px);
	}
	.desc3 {
		place-self: center;
		margin-right: -15vw;
	}

	.about-main {
		width: 100%;
		display: grid;
		/* grid-template-columns: 60vw 1fr; */
	}

	.about-video2 {
		flex: 1 1 30%;
		align-self: center;
		width: 30vw;
		aspect-ratio: 0.5625;
		overflow: hidden;
		margin-left: 1vw;
		margin-top: -10vh;
		border-radius: 5px;
	}
	video {
		margin-top: -2.5%;
		width: 100%;
		height: 110%;
		object-fit: cover;
		object-position: center;
	}
</style>
