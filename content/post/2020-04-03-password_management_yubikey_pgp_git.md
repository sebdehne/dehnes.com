---
layout: post
title:  "Password management using YuBiKey, PGP/GnuPG and GIT"
date:   2020-04-01   20:00:00
author: Sebastian Dehne
URL:     "/software/2020/04/03/password_management_yubikey_pgp_git.html"
categories: [ software ]
draft: true
---

## Overview
{{< lightbox src="/img/passwords/overview.png" lightbox="passwords" title=" ">}}

Basically, all passwords are kept in a one-password-per-file structure according to [pass](https://www.passwordstore.org/) format
which are encrypted using PGP (GnuPG) and version controlled using git. This git repository is kept in sync across 
devices using a remote git hosting service like [GitHUB](https://www.github.com/).

The nice part about this solution is that the private keys, which are needed to decrypt, and thus to access any password,
are kept in a [YuBiKey](https://www.yubico.com/product/yubikey-5-nfc). That minimizes the risk of someone else getting
access to those keys and you do not have to type your passphrase each time, which is unsecure because og keylogging and
also quite inconvenient on smartphones.

The [YuBiKey](https://www.yubico.com/product/yubikey-5-nfc) has a USB interface and NFC support - which makes it
really convenient to be used together with smartphones. The YuBiKey has support for different protocols, and for this
setup we will be using it as a PGP-smartcard. That provides for:

- decryption of the password files
- ssh authentication with the remote git service

There are multiple guides on how to setup this up already which I will just link to.

## PGP key setup
First you need to setup your encryption keys (check out [this video](https://www.youtube.com/watch?v=AQDCe585Lnc) if you 
do not understand the concept og public/private keys yet).

Follow [Guide to using YubiKey for GPG and SSH](https://github.com/drduh/YubiKey-Guide) to set up your PGP-keys. 

You do not need to worry about the expire time of your keys (I used 6 months). You can quite easily extend the expire 
time later. You could also generate a complete new set of keys (using the same master key) and re-encrypt your passwords 
using the new key set. But be aware of the nature of git, which still has the files using the old keys in its history. You should get 
rid of that history when you rotate your keys.  

Once you have setup your keys and stored a backup of your keys in a secure offline place, you can continue setting
this up on your clients:

## Windows + setting up the git repository
Install:
- [gpg4win](https://www.gpg4win.org/)
- [putty](https://www.putty.org/) (use the installer to ensure everything we need is properly installed)
- [Git](https://git-scm.com/download/win)

Next you need to import your public keys. Open `cmd` and run:

    $ gpg --import public.key.txt

And verify you have them imported using:

    $ gpg --list-keys

But gpg does not have your private keys yet, so this command should give an empty output:

    $ gpg --list-secret-keys

So far so good. now we need to tell `gpg` that the private keys are on the YuBiKey. Insert the YuBiKey into one of your USB ports
and type:

    $ gpg --card-status

You should see your YuBiKey detected as a GPG-smartcard and you will also see your 3 private keys. Now try
to list your private keys again:

    $ gpg --list-secret-keys

You should now see that gpg knows that the secret keys which belong to your public keys are on the YuBiKey (note the 
`>` character, which means the secret key is on the smartcard)
   
### SSH authentication
Next step is to setup ssh authentication. We are going to use PuTTY for that. So if you already have

## Mac

## Ubuntu/Linux

## Android 
Download and install [OpenKeyChain](https://www.openkeychain.org/) on your phone and import your public key. Once your
public key is imported you need to verify your key: Open the OpenKeyChain app and hold your YuBiKey to the 
backside of your phone. You should see that the OpenKeyChain app communicates with the YuBiKey using NFC and
imports also information about that your YuBiKey holds the private keys for those public keys. Now the app knows
that when it needs to access the private keys, it needs to ask for you to hold the YuBiKey against the backside of
your phone.

Now you are install the [password manager store app](https://github.com/android-password-store/Android-Password-Store)

Open the settings and configure `git server settings`:
- `ssh` as protocol
- username: `git`
- server URL: `github.com`
- repo path: `<your-github-user-name>/password-store`
- Authentication mode: `OpenKeyChain`

In the settings menu under Crypto, you should also select `OpenKeyChain` and select also your key ID.

You are done - you should now be able to clone the repo, view passwords, make changed and push the repo.

