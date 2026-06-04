<?php

namespace App\Console\Commands;

use App\Models\Customer;
use App\Services\ElasticsearchService;
use Illuminate\Console\Command;

class SyncCustomersToElasticsearch extends Command
{
  
    protected $signature = 'customers:sync-elasticsearch';

   
    protected $description = 'Sync all customers from database to Elasticsearch';

    public function __construct(
        private readonly ElasticsearchService $elasticsearchService
    ) {
        parent::__construct();
    }

  
    public function handle(): void
    {
        $customers = Customer::all();

        if ($customers->isEmpty()) {
            $this->info('No customers found to sync.');
            return;
        }

        $this->info("Syncing {$customers->count()} customers to Elasticsearch...");

        $bar = $this->output->createProgressBar($customers->count());
        $bar->start();

        foreach ($customers as $customer) {
            $this->elasticsearchService->indexCustomer($customer->toArray());
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Sync completed successfully!');
    }
}