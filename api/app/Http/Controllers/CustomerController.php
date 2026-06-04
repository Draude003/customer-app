<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\ElasticsearchService;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function __construct(
        private readonly ElasticsearchService $elasticsearchService
    ) {}

    /**
     * Display a listing of customers.
     * If search query is provided, search via Elasticsearch.
     * Otherwise, return all customers from the database.
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        if ($request->has('search') && $request->search !== '') {
            $results = $this->elasticsearchService->searchCustomers($request->search);
            return response()->json(['data' => $results]);
        }

        $customers = Customer::all();
        return CustomerResource::collection($customers);
    }

    /**
     * Store a newly created customer.
     * Saves to database and syncs to Elasticsearch.
     */
    public function store(StoreCustomerRequest $request): CustomerResource
    {
        $customer = Customer::create($request->validated());
        $this->elasticsearchService->indexCustomer($customer->toArray());

        return new CustomerResource($customer);
    }

    /**
     * Display the specified customer.
     */
    public function show(Customer $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }

    /**
     * Update the specified customer.
     * Updates database and syncs to Elasticsearch.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer): CustomerResource
    {
        $customer->update($request->validated());
        $this->elasticsearchService->indexCustomer($customer->toArray());

        return new CustomerResource($customer);
    }

    /**
     * Remove the specified customer.
     * Deletes from database and removes from Elasticsearch.
     */
    public function destroy(Customer $customer): JsonResponse
    {
        $this->elasticsearchService->deleteCustomer($customer->id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully.']);
    }
}