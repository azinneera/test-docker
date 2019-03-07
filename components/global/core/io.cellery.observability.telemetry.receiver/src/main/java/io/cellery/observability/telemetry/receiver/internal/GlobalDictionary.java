/*
 *  Copyright (c) 2018 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

package io.cellery.observability.telemetry.receiver.internal;

import org.apache.log4j.Logger;

/**
 * This class holds the list of words that is treated as a global dictionary for the key/value that was sent
 * along the report request. The data stored int he global dictionary is shared among all the request.
 */
public class GlobalDictionary {
    private static final Logger log = Logger.getLogger(GlobalDictionary.class);

    private static GlobalDictionary instance = new GlobalDictionary();

    private String[] dictionary = new String[]{
            "source.ip",
            "source.port",
            "source.name",
            "source.uid",
            "source.namespace",
            "source.labels",
            "source.user",
            "target.ip",
            "target.port",
            "target.service",
            "target.name",
            "target.uid",
            "target.namespace",
            "target.labels",
            "target.user",
            "request.headers",
            "request.id",
            "request.path",
            "request.host",
            "request.method",
            "request.reason",
            "request.referer",
            "request.scheme",
            "request.size",
            "request.time",
            "request.useragent",
            "response.headers",
            "response.size",
            "response.time",
            "response.duration",
            "response.code",
            ":authority",
            ":method",
            ":path",
            ":scheme",
            ":status",
            "access-control-allow-origin",
            "access-control-allow-methods",
            "access-control-allow-headers",
            "access-control-max-age",
            "access-control-request-method",
            "access-control-request-headers",
            "accept-charset",
            "accept-encoding",
            "accept-language",
            "accept-ranges",
            "accept",
            "access-control-allow",
            "age",
            "allow",
            "authorization",
            "cache-control",
            "content-disposition",
            "content-encoding",
            "content-language",
            "content-length",
            "content-location",
            "content-range",
            "content-type",
            "cookie",
            "date",
            "etag",
            "expect",
            "expires",
            "from",
            "host",
            "if-match",
            "if-modified-since",
            "if-none-match",
            "if-range",
            "if-unmodified-since",
            "keep-alive",
            "last-modified",
            "link",
            "location",
            "max-forwards",
            "proxy-authenticate",
            "proxy-authorization",
            "range",
            "referer",
            "refresh",
            "retry-after",
            "server",
            "set-cookie",
            "strict-transport-sec",
            "transfer-encoding",
            "user-agent",
            "vary",
            "via",
            "www-authenticate",
            "GET",
            "POST",
            "http",
            "envoy",
            "'200'",
            "Keep-Alive",
            "chunked",
            "x-envoy-service-time",
            "x-forwarded-for",
            "x-forwarded-host",
            "x-forwarded-proto",
            "x-http-method-override",
            "x-request-id",
            "x-requested-with",
            "application/json",
            "application/xml",
            "gzip",
            "text/html",
            "text/html; charset=utf-8",
            "text/plain",
            "text/plain; charset=utf-8",
            "'0'",
            "'1'",
            "true",
            "false",
            "gzip, deflate",
            "max-age=0",
            "x-envoy-upstream-service-time",
            "x-envoy-internal",
            "x-envoy-expected-rq-timeout-ms",
            "x-ot-span-context",
            "x-b3-traceid",
            "x-b3-sampled",
            "x-b3-spanid",
            "tcp",
            "connection.id",
            "connection.received.bytes",
            "connection.received.bytes_total",
            "connection.sent.bytes",
            "connection.sent.bytes_total",
            "connection.duration",
            "context.protocol",
            "context.timestamp",
            "context.time",
            "0",
            "1",
            "200",
            "302",
            "400",
            "401",
            "403",
            "404",
            "409",
            "429",
            "499",
            "500",
            "501",
            "502",
            "503",
            "504",
            "destination.ip",
            "destination.port",
            "destination.service",
            "destination.name",
            "destination.uid",
            "destination.namespace",
            "destination.labels",
            "destination.user",
            "source.service",
            "api.service",
            "api.version",
            "api.operation",
            "api.protocol",
            "request.auth.principal",
            "request.auth.audiences",
            "request.auth.presenter",
            "request.api_key",
            "check.error_code",
            "check.error_message",
            "request.total_size",
            "response.total_size",
            "connection.event",
            "check.cache_hit",
            "quota.cache_hit",
            "source.principal",
            "request.auth.claims",
            "request.auth.raw_claims",
            "connection.mtls",
            "source.metadata",
            "source.owner",
            "source.services",
            "source.workload.uid",
            "source.workload.name",
            "source.workload.namespace",
            "destination.metadata",
            "destination.owner",
            "destination.principal",
            "destination.workload.uid",
            "destination.workload.name",
            "destination.workload.namespace",
            "destination.service.uid",
            "destination.service.name",
            "destination.service.namespace",
            "destination.service.host",
            "destination.container.name",
            "destination.container.image",
            "context.reporter.local",
            "context.reporter.uid",
            "response.grpc_status",
            "response.grpc_message",
            "context.reporter.type",
            "context.reporter.kind",
            "connection.requested_server_name"};

    public static GlobalDictionary getInstance() {
        return instance;
    }

    public String getValue(int index) {
        if (index >= 0 && index < this.dictionary.length) {
            return this.dictionary[index];
        }
        return null;
    }
}
