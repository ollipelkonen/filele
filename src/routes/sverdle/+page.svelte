<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import Dropzone from "svelte-file-dropzone";
	import { fromEvent } from "file-selector";

	interface Props {
		data: PageData;
		form: ActionData;
	}
	let { data, form = $bindable(), }: Props = $props();

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

	function startDragFile(event: DragEvent) {
		console.log("___ StartDragFile", event);
		//event.preventDefault();
    event.stopPropagation();
		event.dataTransfer.clearData();
		//e.dataTransfer.setData('image/svg+xml','https://cdn.sstatic.net/Img/teams/teams-promo.svg');
		//e.dataTransfer.setData('DownloadURL','https://cdn.sstatic.net/Img/teams/teams-promo.svg');
		event.dataTransfer.setData('DownloadURL','image/svg+xml:teams-promo.svg:https://cdn.sstatic.net/Img/teams/');
		//e.dataTransfer.setData('id', e.target.getAttribute("id") );

		event.dataTransfer.setData('text/plain','satan');
		event.dataTransfer.effectAllowed = "all";

		/*e.dataTransfer.setData("download", 'https://cdn.sstatic.net/Img/teams/teams-promo.svg');
		e.dataTransfer.setData("href", 'https://cdn.sstatic.net/Img/teams/teams-promo.svg');
		e.dataTransfer.setData("downloadUrl", 'https://cdn.sstatic.net/Img/teams/teams-promo.svg');
		e.dataTransfer.setData("filename", "BÖAAAA");*/
		
	}

	let inputFiles, pos, edit;

</script>

<svelte:head>
	<title>Sverdle</title>
	<meta name="description" content="written in SvelteKit" />
</svelte:head>

<h1 class="visually-hidden">Sverdle</h1>

<button onclick={(e) => {
	fetch( '/content?id=26' )
		.then( (response) => {
			console.log(response);
			return response.text();
		})
		.then( (data) => {
			console.log(data);
		});
}}>
GET</button>

<form
	bind:this={form}
	method="post"
	action="?/insert"
	enctype="multipart/form-data"
	onchange={(e) => {
		console.log("onchange",form,e)
		//form.submit();
	}}
>
	<div role="button" style="width:100%; height:20em; background-color:#446699;position:relative;" 
		tabindex="0"
		ondragenter={(event)=>{event.preventDefault();console.log("__dragEnter",event)}}
		{onpointermove}
		ondrop={ (event:DragEvent) => {
			event.preventDefault();
    	event.stopPropagation();

			const dow = event.dataTransfer.getData("download");
			const href = event.dataTransfer.getData("href");
			const downloadUrl = event.dataTransfer.getData("downloadUrl");
			const filename = event.dataTransfer.getData("filename");
			const data = event.dataTransfer.getData("data");
			const type = event.dataTransfer.getData("type");
			const value = event.dataTransfer.getData("value");
			const githubsvg = event.dataTransfer.getData("github.svg");
			const svg = event.dataTransfer.getData("image/svg+xml");
			const txt = event.dataTransfer.getData("text/plain");
			const png = event.dataTransfer.getData("image/png");
			
			console.log("__T", event.dataTransfer.types);
			console.log("__I", event.dataTransfer.items);
			console.log("__worn? ", dow, href, downloadUrl, filename, data, type, value, githubsvg, svg, txt, png );
			event.dataTransfer.types.forEach( m => {
				console.log("___M ", m, event.dataTransfer.getData(m))
			});

			let f = event.dataTransfer.getData("Files");
			console.log("-__fkso", f.files,f.maxItems);
			Promise.resolve(f).then( kk => {
				console.log("___ASA_",kk)
			})
			

			//types = Files

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
			console.log("__datatt", typeof event.dataTransfer)
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
			<div draggable="true" class="imga" style="{iconSize}
				ondragstart={startDragFile}
				id={file.id_file}
				position:absolute;
				left:{file.pos.x}px;top:{file.pos.y}px;
				">
				<img draggable="false" style="{iconSize};position:absolute;left:0;top:0;" src="{mimePath}/{file.mime.replaceAll('/','-')}.svg"/>
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
