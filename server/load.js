import Imap from 'imap';
import { inspect } from 'util';
import dotenv from 'dotenv';

dotenv.config();

export function fetchEmails(callback) {
    const imap = new Imap({
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: true
    });

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
        openInbox(function (err, box) {
            if (err) {
                callback(err);
                return;
            }
            imap.search(['ALL'], function (err, results) {
                if (err) {
                    callback(err);
                    return;
                }
                if (!results || !results.length) {
                    callback(null, []);
                    imap.end();
                    return;
                }

                // Nur die letzten 10 E-Mails verarbeiten
                const last10Results = results.slice(-10);

                const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true };
                let emails = [];
                let fetch = imap.fetch(last10Results, fetchOptions);

                fetch.on('message', function (msg, seqno) {
                    let email = { seqno };
                    msg.on('body', function (stream, info) {
                        let buffer = '';
                        stream.on('data', function (chunk) {
                            buffer += chunk.toString('utf8');
                        });
                        stream.once('end', function () {
                            email.header = Imap.parseHeader(buffer);
                        });
                    });
                    msg.once('end', function () {
                        emails.push(email);
                    });
                });

                fetch.once('error', function (err) {
                    callback(err);
                });

                fetch.once('end', function () {
                    imap.end();
                    callback(null, emails);
                });
            });
        });
    });

    imap.once('error', function (err) {
        callback(err);
    });

    imap.connect();
}