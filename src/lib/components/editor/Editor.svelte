<script lang="ts">
	import { PUBLIC_LIVEBLOCKS } from '$env/static/public';
	import { createClient } from '@liveblocks/client';
	import LiveblocksProvider from '@liveblocks/yjs';
	import { Editor } from '@tiptap/core';
	import Collaboration from '@tiptap/extension-collaboration';
	import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
	import Placeholder from '@tiptap/extension-placeholder';
	import StarterKit from '@tiptap/starter-kit';
	import { onMount } from 'svelte';
	import * as Y from 'yjs';
	import './Editor.css';

	export let docid: string;

	let element: HTMLDivElement;
	let editor: any;

	// Set up Liveblocks client
	const client = createClient({
		publicApiKey: PUBLIC_LIVEBLOCKS
	});
	function outerHTML(node: any) {
		return node.outerHTML || new XMLSerializer().serializeToString(node);
	}

	onMount(() => {
		// Enter a multiplayer room
		const { room, leave } = client.enterRoom(docid, { initialPresence: {} });

		// Set up Yjs document, shared text, and Liveblocks Yjs provider
		const yDoc = new Y.Doc();
		const yText = yDoc.getText('tiptap');

		// Prepopulate the text editor with some initial content
		const yProvider = new LiveblocksProvider(room, yDoc);

    editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({
          // The Collaboration extension comes with its own history handling
          history: false
        }),
        // Register the Yjs document with Tiptap
        Collaboration.configure({
          document: yDoc
        }),
        CollaborationCursor.configure({
          provider: yProvider
        }),
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty'
        })
      ],
      onTransaction: () => {
        // Force re-render so `editor.isActive` works as expected
        editor = editor;
      }
    });

		return () => {
			editor?.destroy();
			leave();
		};
	});
</script>

<div bind:this={element}></div>
