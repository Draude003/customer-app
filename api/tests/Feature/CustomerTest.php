<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Services\ElasticsearchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $mockEs = Mockery::mock(ElasticsearchService::class);
        $mockEs->shouldReceive('indexCustomer')->andReturn(null);
        $mockEs->shouldReceive('deleteCustomer')->andReturn(null);
        $mockEs->shouldReceive('searchCustomers')->andReturn([]);
        $this->app->instance(ElasticsearchService::class, $mockEs);
    }

    #[Test]
    public function it_can_list_all_customers(): void
    {
        Customer::factory()->count(3)->create();

        $response = $this->getJson('/api/customers');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    #[Test]
    public function it_can_create_a_customer(): void
    {
        $data = [
            'first_name'     => 'Juan',
            'last_name'      => 'dela Cruz',
            'email'          => 'juan@example.com',
            'contact_number' => '09123456789',
        ];

        $response = $this->postJson('/api/customers', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['email' => 'juan@example.com']);

        $this->assertDatabaseHas('customers', ['email' => 'juan@example.com']);
    }

    #[Test]
    public function it_cannot_create_customer_with_duplicate_email(): void
    {
        Customer::factory()->create(['email' => 'juan@example.com']);

        $data = [
            'first_name'     => 'Juan',
            'last_name'      => 'dela Cruz',
            'email'          => 'juan@example.com',
            'contact_number' => '09123456789',
        ];

        $response = $this->postJson('/api/customers', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function it_can_view_a_customer(): void
    {
        $customer = Customer::factory()->create();

        $response = $this->getJson("/api/customers/{$customer->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['email' => $customer->email]);
    }

    #[Test]
    public function it_can_update_a_customer(): void
    {
        $customer = Customer::factory()->create();

        $data = [
            'first_name'     => 'Updated',
            'last_name'      => 'Name',
            'email'          => 'updated@example.com',
            'contact_number' => '09987654321',
        ];

        $response = $this->putJson("/api/customers/{$customer->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['email' => 'updated@example.com']);

        $this->assertDatabaseHas('customers', ['email' => 'updated@example.com']);
    }

    #[Test]
    public function it_can_delete_a_customer(): void
    {
        $customer = Customer::factory()->create();

        $response = $this->deleteJson("/api/customers/{$customer->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Customer deleted successfully.']);

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }
}