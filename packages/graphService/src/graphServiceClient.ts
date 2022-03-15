import {UserItemRequestBuilder} from './users/item/userItemRequestBuilder';
import {UsersRequestBuilder} from './users/usersRequestBuilder';
import {enableBackingStoreForSerializationWriterFactory, getPathParameters, ParseNodeFactoryRegistry, registerDefaultDeserializer, registerDefaultSerializer, RequestAdapter, SerializationWriterFactoryRegistry} from '@microsoft/kiota-abstractions';
import {JsonParseNodeFactory, JsonSerializationWriterFactory} from '@microsoft/kiota-serialization-json';
import {FetchRequestAdapter} from "@microsoft/kiota-http-fetchlibrary"

import { ClientOptions } from "@microsoft/microsoft-graph-client";
import { GraphBaseClient } from '@microsoft/microsoft-graph-client';

/** The main entry point of the SDK, exposes the configuration and the fluent API.  */
export class GraphServiceClient  extends GraphBaseClient{
    /** Path parameters for the request  */
    private readonly pathParameters: Record<string, unknown>;
    /** The request adapter to use to execute the requests.  */
    private readonly requestAdapter: RequestAdapter;
    /** Url template to use to build the URL for the current request builder  */
    private readonly urlTemplate: string;
    public get users(): UsersRequestBuilder {
        return new UsersRequestBuilder(this.pathParameters, this.requestAdapter);
    }
    /**
     * Instantiates a new GraphServiceClient and sets the default values.
     * @param requestAdapter The request adapter to use to execute the requests.
     */
     public constructor(clientOptions: ClientOptions) {
        clientOptions.SDKNameWithVersion = "ServiceLibraryVersion";
        super(clientOptions);
        // change to this.authprovider
        const requestAdapter = new FetchRequestAdapter(clientOptions.authProvider, undefined, undefined, this.httpClient);    ;
            if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
        this.pathParameters = {};
        this.urlTemplate = "{+baseurl}";
        this.requestAdapter = requestAdapter;
        registerDefaultSerializer(JsonSerializationWriterFactory);
        registerDefaultDeserializer(JsonParseNodeFactory);
        requestAdapter.baseUrl = "https://graph.microsoft.com/v1.0";
    };
    /**
     * Gets an item from the MicrosoftGraph.users.item collection
     * @param id Unique identifier of the item
     * @returns a userItemRequestBuilder
     */
    public usersById(id: string) : UserItemRequestBuilder {
        if(!id) throw new Error("id cannot be undefined");
        const urlTplParams = getPathParameters(this.pathParameters);
        urlTplParams["user_id"] = id
        return new UserItemRequestBuilder(urlTplParams, this.requestAdapter);
    };
    // public static init(clientOptions: ClientOptions): GraphServiceClient {
    //     const client = new GraphServiceClient(clientOptions);
    //     return client;
    // }

    // public api(path: string): GraphRequest {
    //     return super.api(path);
    // }
}