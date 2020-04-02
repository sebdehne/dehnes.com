---
layout: post
title:  "How I keep my passwords"
date:   2020-03-31 20:00:00
author: Sebastian Dehne
URL:     "/construction/2020/03/31/how_i_keep_my_passwords.html"
categories: [ software ]
draft: true
---

{{< lightbox src="/img/passwords/overview.png" lightbox="passwords" title="Overview">}}


- gpg keys
- gpg-smartcard setup

Windows:
- gpg4win
= import public keys
= how did I tell windows gpg that the keys are on the smartcard?
= gpg-list-keys
= my gpg-agent.conf

- install putty
- enable-putty-support
- ssh-add -l -> outputs the public ssh key

- SSH_GIT=plink.exe
- check git pull/push works

Move on the QtPass

Android:
- OpenKeyChain
- import public key
- import from smartCard
=> key is now verified

- Android-password-manager
= use openKeyChain
= use correct git URL for ssh
