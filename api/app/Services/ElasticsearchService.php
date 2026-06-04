<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

class ElasticsearchService
{
    /**
     * The base URL of the Elasticsearch service.
     */
    private string $baseUrl;

    /**
     * The index name for customers in Elasticsearch.
     */
    private string $index = 'customers';

    public function __construct()
    {
        $this->baseUrl = config('services.elasticsearch.host');
    }

    /**
     * Index a customer document in Elasticsearch.
     * Called when a customer is created or updated.
     */
    public function indexCustomer(array $customer): void
    {
        Http::put("{$this->baseUrl}/{$this->index}/_doc/{$customer['id']}", [
            'id'             => $customer['id'],
            'first_name'     => $customer['first_name'],
            'last_name'      => $customer['last_name'],
            'full_name'      => $customer['first_name'] . ' ' . $customer['last_name'],
            'email'          => $customer['email'],
            'contact_number' => $customer['contact_number'],
        ]);
    }

    /**
     * Delete a customer document from Elasticsearch.
     * Called when a customer is deleted.
     */
    public function deleteCustomer(int $id): void
    {
        Http::delete("{$this->baseUrl}/{$this->index}/_doc/{$id}");
    }

    /**
     * Search customers in Elasticsearch by name or email.
     */
   public function searchCustomers(string $query): array
{
    $response = Http::post("{$this->baseUrl}/{$this->index}/_search", [
        'query' => [
            'bool' => [
                'should' => [
                    [
                        'multi_match' => [
                            'query'     => $query,
                            'fields'    => ['first_name', 'last_name', 'full_name', 'email'],
                            'type'      => 'best_fields',
                            'fuzziness' => 'AUTO',
                        ],
                    ],
                    [
                        'query_string' => [
                            'query'  => "*{$query}*",
                            'fields' => ['first_name', 'last_name', 'full_name', 'email'],
                        ],
                    ],
                ],
            ],
        ],
    ]);

    $hits = $response->json('hits.hits') ?? [];

    return array_map(fn($hit) => $hit['_source'], $hits);
}
}