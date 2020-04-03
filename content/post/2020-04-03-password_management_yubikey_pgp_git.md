---
layout: post
title:  "Password management using YuBiKey, PGP/GnuPG and GIT"
date:   2020-04-03 20:00:00
author: Sebastian Dehne
URL:     "/software/2020/04/03/password_management_yubikey_pgp_git.html"
categories: [ software ]
---

* [ Overview ](#overview)
* [ PGP key setup ](#pgp-key-setup)
* [ Windows + setting up the git repository ](#windows--setting-up-the-git-repository)
   * [ SSH authentication ](#ssh-authentication)
* [ Mac ](#mac)
   * [ SSH authentication ](#ssh-authentication-1)
* [ Android ](#android)
   * [ OpenKeyChain ](#openkeychain)
   * [ Android Password Store ](#android-password-store)

## Overview
{{< lightbox src="/img/passwords/overview.png" lightbox="passwords" title=" ">}}

Basically, all passwords are kept in a one-password-per-file structure according to [pass](https://www.passwordstore.org/) format
which are encrypted using PGP (GnuPG) and version controlled using git. This git repository is kept in sync across 
devices using a remote git hosting service like [GitHUB](https://www.github.com/).

The nice part about this solution is that the private/secret keys, which are needed every time to access a password,
are kept in a [YuBiKey](https://www.yubico.com/product/yubikey-5-nfc) and therefore not stored and distributed on any of my
devices. Without this YuBiKey, I cannot decrypt any of the encrypted password files which are distributed across my devices. 
That minimizes the risk of someone else getting access to those keys and it is not needed to type a passphrase each time 
to unlock the secret key, which is insecure because of the possibility of keylogging. It is also inconvenient to type a passphrase on smartphones.

The [YuBiKey](https://www.yubico.com/product/yubikey-5-nfc) has a USB interface and NFC support - which makes it
really convenient to be used together with smartphones. The YuBiKey has support for different protocols, and for this
setup we will be using it as a PGP-smartcard. That provides for:

- decryption of the password files
- ssh authentication with the remote git service

There are multiple guides on how to setup this up already which I will just link to.

## PGP key setup
First you need to setup your encryption keys (check out [this video](https://www.youtube.com/watch?v=AQDCe585Lnc) if you 
do not understand the concept og public/private keys yet).

Follow [Guide to using YubiKey for GPG and SSH](https://github.com/drduh/YubiKey-Guide) to set up your PGP-keys correctly 
on your YuBiKey.

Do not worry about the expire time of your keys (I used 6 months). You can quite easily extend the expire 
time later. You could also generate a complete new set of keys (using the same master key) and re-encrypt your passwords 
using the new key set. But be aware of the nature of git, which still has the files using the old keys in its history. You should get 
rid of that history when you rotate your keys.  

Once you have setup your PGP keys on your YuBiKey and stored also a backup of them in a secure offline place, you 
can continue setting this up on your clients:

## Windows + setting up the git repository
Install the  following:

- [gpg4win](https://www.gpg4win.org/)
- [putty](https://www.putty.org/) (use the installer to ensure everything we need is properly installed)
- [Git](https://git-scm.com/download/win)

Next you need to import your **public** keys into your local GnuPG installation. Open `cmd` and run:

    $ gpg --import public.key.txt
    gpg: keybox 'C:/Users/yourUsername/AppData/Roaming/gnupg/pubring.kbx' created
    gpg: C:/Users/yourUsername/AppData/Roaming/gnupg/trustdb.gpg: trustdb created
    gpg: key 4A77FE3D76CDDBF2: public key "Your Name <yourUserId@example.com>" imported
    gpg: Total number processed: 1
    gpg:               imported: 1

And verify you have them imported using:

    $ gpg --list-keys
    C:/Users/yourUsername/AppData/Roaming/gnupg/pubring.kbx
    ------------------------------------------------
    pub   rsa4096 2020-03-29 [SC]
          FD4537161A3AB6D4578C6D134A77FE3D76CDDBF2
    uid           [ultimate] Your Name <yourUserId@example.com>
    sub   rsa4096 2020-03-29 [S] [expires: 2020-10-25]
    sub   rsa4096 2020-03-29 [E] [expires: 2020-10-25]
    sub   rsa4096 2020-03-29 [A] [expires: 2020-10-25]

But gpg does not have your private keys yet (which are needed for decryption), so this command should give an empty output:

    $ gpg --list-secret-keys

So far so good. now we need to tell `gpg` that the private keys are on the YuBiKey. Insert the YuBiKey into one of your USB ports
and type:

    $ gpg --card-status
    Reader ...........: Yubico YubiKey OTP FIDO CCID 0
    Application ID ...: D2760001240102010006101555010000
    Application type .: OpenPGP
    Version ..........: 2.1
    Manufacturer .....: Yubico
    Serial number ....: 10155501
    Name of cardholder: Your Name
    Language prefs ...: en
    Salutation .......:
    URL of public key : [not set]
    Login data .......: yourUserId@example.com
    Signature PIN ....: not forced
    Key attributes ...: rsa4096 rsa4096 rsa4096
    Max. PIN lengths .: 127 127 127
    PIN retry counter : 3 0 3
    Signature counter : 2
    Signature key ....: 2465 49CD 4E79 EFB7 828E  CCCE 11BF 0B72 4E09 C10F
          created ....: 2020-03-29 09:14:38
    Encryption key....: BA38 748D 161F CA2D 008F  D8EF 49D3 212A 99F7 183F
          created ....: 2020-03-29 09:16:30
    Authentication key: 88CF C223 9A0E 3DFA 09CE  643C F1F4 D8F8 675E E2CA
          created ....: 2020-03-29 09:22:55
    General key info..: sub  rsa4096/11BF0B724E09C10F 2020-03-29 Your Name <yourUserId@example.com>
    sec#  rsa4096/4A77FE3D76CDDBF2  created: 2020-03-29  expires: never
    ssb>  rsa4096/11BF0B724E09C10F  created: 2020-03-29  expires: 2020-10-25
                                    card-no: 0006 10155501
    ssb>  rsa4096/49D3212A99F7183F  created: 2020-03-29  expires: 2020-10-25
                                    card-no: 0006 10155501
    ssb>  rsa4096/F1F4D8F8675EE2CA  created: 2020-03-29  expires: 2020-10-25
                                    card-no: 0006 10155501
    
You should see your YuBiKey detected as a GPG-smartcard and you will also see your 3 private keys as shown above. Now try
to list your private keys again:

    $ gpg --list-secret-keys
    C:/Users/yourUsername/AppData/Roaming/gnupg/pubring.kbx
    ------------------------------------------------
    sec#  rsa4096 2020-03-29 [SC]
          FD4537161A3AB6D4578C6D134A77FE3D76CDDBF2
    uid           [ unknown] Your Name <yourUserId@example.com>
    ssb>  rsa4096 2020-03-29 [S] [expires: 2020-10-25]
    ssb>  rsa4096 2020-03-29 [E] [expires: 2020-10-25]
    ssb>  rsa4096 2020-03-29 [A] [expires: 2020-10-25]

You should now see that gpg knows that the secret keys which belong to your public keys are on the YuBiKey (note the 
`>` character, which means the secret key is on the smartcard. `#` behind the masterkey means that the key is missing - which
is correct. gpg should not have access to the secret master key).

### SSH authentication
Next step is to setup ssh authentication. We are going to use PuTTY for that.

The git-for-windows installer also installs a native OpenSSH client on windows. But I was not able to make this work with GPG. 
Therefore I switched to using Putty which works fine. 

Normally, PuTTY uses it own ssh-agent called `pageant.exe`. But in order to make PuTTY work together with GPG, we are going to 
replace `pageant.exe` and let PuTTY connect to the `gpg-agent` instead.

Configure the gpg-agent to act as the putty agent by using the following `%APPDATA%\gnupg\gpg-agent.conf`:

     enable-putty-support
     enable-ssh-support
     default-cache-ttl 60
     max-cache-ttl 120
     pinentry-program "C:\Program Files (x86)\Gpg4win\bin\pinentry.exe"

Now restart the gpg-agent:
    
    $ gpgconf --kill gpg-agent
    $ gpg-connect-agent /bye
    gpg-connect-agent: no running gpg-agent - starting 'C:\Program Files (x86)\Gpg4win\..\GnuPG\bin\gpg-agent.exe'
    gpg-connect-agent: waiting for the agent to come up ... (5s)
    gpg-connect-agent: connection to agent established

Now everything should be setup correctly. Extract your ssh public key as follows:

    $ gpg --export-ssh-key yourUserId@example.com
    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCzJLTKb4foiyAMQWsnviiSKrEoVVZn8rGKScLZid8hXyKws7D7+7uudEMG7H1E05eLtOM68tp7G
    TjeoesY9pwSOtw3Jc10mM3w1XxkLR3UqpBbFbMRUAelL+Q9T2VmWMU35aBrXGuA2Gbt30qZjVUV6g/AuFY+euRQJgFNzbzQW6PTn16gEBqF/d6/+U
    o9j/aYisvpQTPf73ADQEFdqvwLKphLURnK7XfNtAHLuw== openpgp:0x675EE2CA

Add this key to your GitHUB account under SSH-keys. You can also use this key for any other ssh service, just copy it
to your remote ssh-server into the file `.ssh/authorized_keys`.

Next step is to tell the windows git client to use PuTTY as its ssh client. Do this by setting the `GIT_SSH` env variable
to `pling.exe`.

    $ SET GIT_SSH="C:\Program Files\PuTTY\plink.exe"

Make it permament by adding it to your windows environment. Right-click "Your Computer" -> Advanced systemsettings -> Environment 
variables and restart your shell.

You should now be able to pull/push your git repository using git and your YuBiKey:

    $ cd password-store
    $ git pull

And you will be asked for your pin:

{{< lightbox src="/img/passwords/enter-pin.png" lightbox="passwords" title=" ">}}

You are done. You can use a GUI tool such as [QtPass](https://qtpass.org/) if you'd like. 

## Mac
Assuming this is the first time you are using GPG on your mac. First you need to install GnuPG:

    $ brew install gnupg2 pinentry-mac
    
(Or use any other method to install it).

Next, import your **public** key:

    $ gpg --import public.key.txt
    gpg: directory '/Users/yourUsername/.gnupg' created
    gpg: keybox '/Users/yourUsername/.gnupg/pubring.kbx' created
    gpg: /Users/yourUsername/.gnupg/trustdb.gpg: trustdb created
    gpg: key 4A77FE3D76CDDBF2: public key "Your Name <yourUserId@example.com>" imported
    gpg: Total number processed: 1
    gpg:               imported: 1

And verify you have them imported using:

    $ gpg --list-keys
    /Users/yourUsername/.gnupg/pubring.kbx
    -------------------------------
    pub   rsa4096 2020-03-29 [SC]
          FD4537161A3AB6D4578C6D134A77FE3D76CDDBF2
    uid           [ unknown] Your Name <yourUserId@example.com>
    sub   rsa4096 2020-03-29 [S] [expires: 2020-10-25]
    sub   rsa4096 2020-03-29 [E] [expires: 2020-10-25]
    sub   rsa4096 2020-03-29 [A] [expires: 2020-10-25]
    
But gpg does not have your private keys yet (which are needed for decryption), so this command should give an empty output:

    $ gpg --list-secret-keys

So far so good. now we need to tell `gpg` that the private keys are on the YuBiKey. Insert the YuBiKey into one of your USB ports
and type:

    $ gpg --card-status
    Reader ...........: Yubico YubiKey OTP FIDO CCID 0
    Application ID ...: D2760001240102010006101555010000
    Application type .: OpenPGP
    Version ..........: 2.1
    Manufacturer .....: Yubico
    Serial number ....: 10155501
    Name of cardholder: Your Name
    Language prefs ...: en
    Salutation .......:
    URL of public key : [not set]
    Login data .......: yourUserId@example.com
    Signature PIN ....: not forced
    Key attributes ...: rsa4096 rsa4096 rsa4096
    Max. PIN lengths .: 127 127 127
    PIN retry counter : 3 0 3
    Signature counter : 2
    Signature key ....: 2465 49CD 4E79 EFB7 828E  CCCE 11BF 0B72 4E09 C10F
          created ....: 2020-03-29 09:14:38
    Encryption key....: BA38 748D 161F CA2D 008F  D8EF 49D3 212A 99F7 183F
          created ....: 2020-03-29 09:16:30
    Authentication key: 88CF C223 9A0E 3DFA 09CE  643C F1F4 D8F8 675E E2CA
          created ....: 2020-03-29 09:22:55
    General key info..: sub  rsa4096/11BF0B724E09C10F 2020-03-29 Your Name <yourUserId@example.com>
    sec#  rsa4096/4A77FE3D76CDDBF2  created: 2020-03-29  expires: never
    ssb>  rsa4096/11BF0B724E09C10F  created: 2020-03-29  expires: 2020-10-25
                                    card-no: 0006 10155501
    ssb>  rsa4096/49D3212A99F7183F  created: 2020-03-29  expires: 2020-10-25
                                    card-no: 0006 10155501
    ssb>  rsa4096/F1F4D8F8675EE2CA  created: 2020-03-29  expires: 2020-10-25
                                    card-no: 0006 10155501
    
You should see your YuBiKey detected as a GPG-smartcard and you will also see your 3 private keys as shown above. Now try
to list your private keys again:

    $ gpg --list-secret-keys
    /Users/yourUsername/.gnupg/pubring.kbx
    ------------------------------------------------
    sec#  rsa4096 2020-03-29 [SC]
          FD4537161A3AB6D4578C6D134A77FE3D76CDDBF2
    uid           [ unknown] Your Name <yourUserId@example.com>
    ssb>  rsa4096 2020-03-29 [S] [expires: 2020-10-25]
    ssb>  rsa4096 2020-03-29 [E] [expires: 2020-10-25]
    ssb>  rsa4096 2020-03-29 [A] [expires: 2020-10-25]

You should now see that gpg knows that the secret keys which belong to your public keys are on the YuBiKey (note the 
`>` character, which means the secret key is on the smartcard. `#` behind the masterkey means that the key is missing - which
is correct. gpg should not have access to the secret master key).

### SSH authentication
Next step is to setup ssh authentication. Normally, the `ssh` client will connect to the `ssh-agent`, but in order to
make ssh authentication work together with GPG, we need to make `ssh` connect to the `gpg-agent` instead. This can be done
by ensuring the ssh-agent is **not** running:

    $ killall ssh-agent

Next, configure the `gpg-agent` by placing the following content into the file `/Users/yourUsername/.gnupg/gpg-agent.conf`

    enable-ssh-support
    default-cache-ttl 60
    max-cache-ttl 120
    pinentry-program /usr/local/bin/pinentry-mac
    
Now restart the `gpg-agent`:

    $ killall gpg-agent
    $ gpg-connect-agent /bye
    gpg-connect-agent: no running gpg-agent - starting '/usr/local/Cellar/gnupg/2.2.20/bin/gpg-agent'
    gpg-connect-agent: waiting for the agent to come up ... (5s)
    gpg-connect-agent: connection to agent established

Now the `gpg-agent` is ready, all we need to do is to tell `ssh` to use the `gpg-agent` instead of the default `ssh-agent`. That
is done by setting the environment variable `SSH_AUTH_SOCK` as follows:

    $ export SSH_AUTH_SOCK=/Users/yourUsername/.gnupg/S.gpg-agent.ssh
    
Make this permanent by placing this command in `.bash_profile`

Done. You should now be able to `git pull` and `git push` your password repository using your YuBiKey. 

## Android 
### OpenKeyChain
Download and install [OpenKeyChain](https://www.openkeychain.org/) on your phone and import your **public** key. Once your
public key is imported you need to verify your key: Open the OpenKeyChain app and hold your YuBiKey to the 
backside of your phone. You should see that the OpenKeyChain app communicates with the YuBiKey using NFC and
imports also information about that your YuBiKey holds the private keys for those public keys. Now the app knows
that when it needs to access the private keys, it needs to ask for you to hold the YuBiKey against the backside of
your phone.

### Android Password Store
Now you can install the [password manager store app](https://github.com/android-password-store/Android-Password-Store)

Open settings and configure `git server settings`:

- `ssh` as protocol
- username: `git`
- server URL: `github.com`
- repo path: `<your-github-user-name>/password-store`
- Authentication mode: `OpenKeyChain`

In the settings menu under Crypto, you should also select `OpenKeyChain` and select also your key ID.

Assuming you have added your public ssh-key to your GitHUB account as explained above, you should now be able to clone 
the repo, view passwords, make changes and push the repo using your YuBiKey on your Android phone.

