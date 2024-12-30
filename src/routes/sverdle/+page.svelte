<script lang="ts">
	import { enhance } from '$app/forms';
	import { confetti } from '@neoconfetti/svelte';
	import type { ActionData, PageData } from './$types';
	import { reducedMotion } from './reduced-motion';
	import Dropzone from "svelte-file-dropzone";
	import { fromEvent } from "file-selector";

	interface Props {
		data: PageData;
		form: ActionData;
	}
	let { data, form = $bindable(), }: Props = $props();

	//const mimePath = "/static/images/Yaru48x48mimetypes";
	//const mimePath = "/images/Yaru48x48mimetypes";
	const mimePath = "/images/Humanity48x48";
	const iconHeight = 48;
	const iconWidth = 48;
	const iconSize = "width:"+iconWidth+"px;height:"+iconHeight+"px;";

	console.log("_____data",data)

	function handleFilesSelect(e) {
		console.log("handleFilesSelect",e);
	}

	let m = $state({ x: 0, y: 0 });

	function onpointermove(event) {
		m.x = event.layerX;
		m.y = event.layerY;
	}

	function startDragFile(e: DragEvent) {
		console.log("___ StartDragFile", e);
		e.dataTransfer.setData('id', e.target.getAttribute("id") )
	}

	let inputFiles, pos, edit;

</script>

<svelte:head>
	<title>Sverdle</title>
	<meta name="description" content="A Wordle clone written in SvelteKit" />
</svelte:head>

<h1 class="visually-hidden">Sverdle</h1>

<form
	bind:this={form}
	method="post"
	action="?/json"
	enctype="multipart/form-data"
	onchange={(e) => {
		console.log("ondrop",form,e)
		//form.submit();
	}}
>
	<div role="button" style="width:100%; height:20em; background-color:#446699;position:relative;" 
		tabindex="0"
		{onpointermove}
		ondrop={ (event:DragEvent) => {
			event.preventDefault();
    	event.stopPropagation();

			//TODO: if id is empty, it's from outside
			const id = event.dataTransfer.getData("id");
			console.log("___ cruso? ", id);
			if (id) {
				pos.value = "{\"x\":" + (event.layerX-iconWidth/2)  + ", \"y\":" + (event.layerY-iconHeight/2) + "}";
				edit.value = id;
				form.submit();
				return;
			}

			console.log("__ondrp", event);
			let list = new DataTransfer();
			Promise.resolve(fromEvent(event)).then( (files) => {

				console.log("___ files",typeof files[0], files[0]);

				if ( typeof files == "DataTransferItem") {
					console.log("oonpas")
				}

				files.forEach( f => 
					list.items.add( f as File )
				);
			})
			.then( k => {
				console.log(event)
				pos.value = "{\"x\":" + (event.layerX-iconWidth/2)  + ", \"y\":" + (event.layerY-iconHeight/2) + "}";
				inputFiles.files = list.files;

				form.submit();

			});
			//  multiple 
		}}
	>
		<Dropzone on:drop={handleFilesSelect} style="position:relative; display:none;"/>
		<p style="padding-left:10em">{Math.round(m.x)} x {Math.round(m.y)}</p>
		{#each data.files as file}
			<div class="imga" style="{iconSize}
				position:absolute;
				left:{file.pos.x}px;top:{file.pos.y}px;
				">
				<img ondragstart={startDragFile} id={file.id_file} style="{iconSize};position:absolute;left:0;top:0;" src="{mimePath}/{file.mime.replaceAll('/','-')}.svg"/>
				{file.name}
			</div>
		{/each}
	</div>
	<input bind:this={inputFiles} class="box__file" type="file" name="files[]" id="file" multiple />
	<input bind:this={pos} type="text" name="pos" id="pos" style="display:none"/>
	<input bind:this={edit} type="text" name="edit" id="edit" style="display:none"/>

</form>


<style>
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
	}

	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		10% {
			transform: translateX(-2px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-6px);
		}
		70% {
			transform: translateX(+4px);
		}
		90% {
			transform: translateX(-2px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
