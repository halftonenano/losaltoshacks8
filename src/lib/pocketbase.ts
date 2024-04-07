import { PUBLIC_API_URL } from '$env/static/public';
import PocketBase, { type AuthModel } from 'pocketbase';
import { writable } from 'svelte/store';
import type { TypedPocketBase } from './types/db';
import { browser } from '$app/environment';

export const pb = new PocketBase(PUBLIC_API_URL) as TypedPocketBase;

export const user = writable<AuthModel>(pb.authStore.model);

if (browser && !pb.authStore.isValid) {
	signOut();
}
try {
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
} catch {}

pb.authStore.onChange((auth) => {
	user.set(pb.authStore.model);
	try {
		document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
	} catch {}
});

export function signOut() {
	pb.authStore.clear();
	eraseCookie('pb_auth');
}

export function eraseCookie(name: string) {
	document.cookie = name + '=; Max-Age=-99999999;';
}
